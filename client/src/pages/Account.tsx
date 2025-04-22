import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle, CreditCard, Settings2, LogOut } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function AccountPage() {
  const { user, isLoading, isAuthenticated, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const params = new URLSearchParams(search);
  const checkoutSuccess = params.get('checkout_success') === 'true';
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  // Show success toast if redirected from successful checkout
  useEffect(() => {
    if (checkoutSuccess) {
      toast({
        title: 'Subscription Updated',
        description: 'Your subscription has been successfully updated.',
        variant: 'default',
      });
      
      // Remove the query parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Refresh subscription data
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
    }
  }, [checkoutSuccess, toast, queryClient]);
  
  // Fetch subscription data
  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['/api/subscription'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      try {
        const res = await apiRequest('GET', '/api/subscription');
        if (!res.ok) throw new Error('Failed to fetch subscription data');
        return await res.json();
      } catch (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }
    },
    enabled: isAuthenticated,
  });
  
  // Fetch user stats and limits
  const { data: userLimits, isLoading: limitsLoading } = useQuery({
    queryKey: ['/api/user/limits'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      try {
        const res = await apiRequest('GET', '/api/user/limits');
        if (!res.ok) throw new Error('Failed to fetch user limits');
        return await res.json();
      } catch (error) {
        console.error('Error fetching user limits:', error);
        return null;
      }
    },
    enabled: isAuthenticated,
  });
  
  const handleCancelSubscription = async () => {
    try {
      const res = await apiRequest('POST', '/api/subscription/cancel');
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }
      
      toast({
        title: 'Subscription Canceled',
        description: 'Your subscription has been canceled. You will have access to premium features until the end of your billing period.',
        variant: 'default',
      });
      
      // Refresh subscription data
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      toast({
        title: 'Cancellation Failed',
        description: error.message || 'Failed to cancel your subscription',
        variant: 'destructive',
      });
    }
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  if (isLoading || subscriptionLoading || limitsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return null; // Will be redirected by useEffect
  }
  
  const getTierName = (tier: string | null) => {
    if (tier === null) return 'Free';
    
    switch (tier) {
      case 'guest': return 'Guest';
      case 'free': return 'Free';
      case 'paid': return 'Pro';
      case 'premium': return 'Premium';
      default: return tier;
    }
  };
  
  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Account</h1>
            <p className="text-muted-foreground">
              Manage your account settings and subscription
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="self-start"
          >
            {logoutMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Username</div>
                    <div>{user.username}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                    <div>{user.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Full Name</div>
                    <div>{user.fullName || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Account Created</div>
                    <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    Edit Profile (Coming Soon)
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Usage</CardTitle>
                  <CardDescription>Track your resource usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Projects 
                      {userLimits?.projectsCount >= userLimits?.projectsLimit ? (
                        <span className="text-red-500 ml-1">(Limit Reached)</span>
                      ) : null}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${Math.min(100, (userLimits?.projectsCount / userLimits?.projectsLimit) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-sm whitespace-nowrap">
                        {userLimits?.projectsCount} / {userLimits?.projectsLimit}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Storage</div>
                    <div className="flex items-center space-x-4">
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${Math.min(100, (userLimits?.storageUsed / userLimits?.storageLimit) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-sm whitespace-nowrap">
                        {userLimits?.storageUsed || 0} / {userLimits?.storageLimit} MB
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Pages per Project</div>
                    <div>{userLimits?.pagesLimit || 1}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Deployment</div>
                    {userLimits?.canDeploy ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Enabled
                      </div>
                    ) : (
                      <div className="flex items-center text-muted-foreground">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Not available (upgrade required)
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Template Creation</div>
                    {userLimits?.canSaveTemplates ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Enabled
                      </div>
                    ) : (
                      <div className="flex items-center text-muted-foreground">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Not available (upgrade required)
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>Manage your subscription plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Current Plan</div>
                    <div className="flex items-center">
                      <div className="text-xl font-semibold">{getTierName(user.accountType || '')}</div>
                      {subscriptionData?.hasActiveSubscription ? (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                          Active
                        </span>
                      ) : user.accountType !== 'guest' && user.accountType !== 'free' ? (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Expired
                        </span>
                      ) : null}
                    </div>
                  </div>
                  
                  {subscriptionData?.hasActiveSubscription && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Next Billing Date</div>
                      <div>
                        {subscriptionData?.subscription?.current_period_end ? (
                          new Date(subscriptionData.subscription.current_period_end * 1000).toLocaleDateString()
                        ) : 'N/A'}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Subscription Management</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => navigate('/pricing')}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {subscriptionData?.hasActiveSubscription ? 'Change Plan' : 'Upgrade Plan'}
                    </Button>
                    
                    {subscriptionData?.hasActiveSubscription && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline">
                            Cancel Subscription
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Canceling your subscription will downgrade your account to the free tier at the end of your
                              current billing period. You will lose access to premium features like deployment and
                              multi-page projects.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleCancelSubscription}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Cancel Subscription
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          

        </Tabs>
      </div>
    </div>
  );
}