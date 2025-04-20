import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Project } from "@shared/schema";
import { format } from "date-fns";
import { 
  PlusCircle, 
  LayoutGrid, 
  List, 
  Loader2,
  MoreHorizontal,
  ExternalLink,
  Eye,
  Edit,
  Trash2,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Projects() {
  const [_, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { user, isGuest } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  // Fetch the user's projects
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery<Project[]>({
    queryKey: ["/api/projects", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await apiRequest("GET", `/api/projects?userId=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      return await response.json();
    },
    enabled: !!user,
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await apiRequest("DELETE", `/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      return projectId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", user?.id] });
      setProjectToDelete(null);
    },
  });

  // Open delete confirmation dialog
  const confirmDelete = (projectId: number) => {
    setProjectToDelete(projectId);
  };

  // Handle delete project
  const handleDeleteProject = () => {
    if (projectToDelete !== null) {
      deleteProjectMutation.mutate(projectToDelete);
    }
  };

  // Project item component (grid view)
  const ProjectGridItem = ({ project }: { project: Project }) => {
    const createdDate = new Date(project.createdAt);
    const formattedDate = format(createdDate, "MMM d, yyyy");

    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <ProjectActions project={project} />
          </div>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description || "No description provided"}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/preview/${project.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate(`/editor/${project.id}`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Project item component (list view)
  const ProjectListItem = ({ project }: { project: Project }) => {
    const createdDate = new Date(project.createdAt);
    const formattedDate = format(createdDate, "MMM d, yyyy");

    return (
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-white hover:shadow-sm transition-shadow">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{project.name}</h3>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/preview/${project.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/editor/${project.id}`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <ProjectActions project={project} />
        </div>
      </div>
    );
  };

  // Project actions dropdown
  const ProjectActions = ({ project }: { project: Project }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate(`/editor/${project.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/preview/${project.id}`)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </DropdownMenuItem>
          {project.published && project.publishedUrl && (
            <DropdownMenuItem 
              onClick={() => window.open(project.publishedUrl!, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View published site
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600" 
            onClick={() => confirmDelete(project.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="h-16 w-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
        <LayoutGrid className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">No projects yet</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        {isGuest 
          ? "As a guest, you can create a landing page to try out LaunchPlate. Create an account to save multiple projects."
          : "Create your first landing page project to get started with LaunchPlate."
        }
      </p>
      <Link href="/editor">
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create new project
        </Button>
      </Link>
    </div>
  );

  // Render loading state
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Unable to load projects</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            There was an error loading your projects. Please try again later.
          </p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/projects", user?.id] })}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <p className="text-gray-500">
            {projects && projects.length > 0 
              ? `You have ${projects.length} project${projects.length === 1 ? '' : 's'}`
              : "Start creating beautiful landing pages"
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 rounded-md p-1 flex">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
          <Link href="/editor">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Account status for guest users */}
      {isGuest && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">Guest Mode</h3>
              <p className="text-amber-700 text-sm mt-1">
                You're currently using LaunchPlate as a guest. Projects created in guest mode may be limited 
                and will not be accessible on other devices. 
                <Link href="/auth">
                  <span className="text-amber-900 font-medium underline ml-1">
                    Create an account
                  </span>
                </Link> to save projects permanently.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Project list */}
      {projects && projects.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectGridItem key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </div>
        )
      ) : (
        <EmptyState />
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog 
        open={projectToDelete !== null} 
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all of its contents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={deleteProjectMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteProjectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}