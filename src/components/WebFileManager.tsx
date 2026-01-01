import { useState, useRef } from "react";
import { 
  Folder, 
  FolderPlus, 
  FilePlus, 
  Upload, 
  Trash2, 
  ChevronRight, 
  ChevronDown,
  FileText,
  FileCode,
  FileImage,
  File
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  file?: File;
}

interface WebFileManagerProps {
  files: FileNode[];
  onChange: (files: FileNode[]) => void;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['html', 'htm'].includes(ext || '')) return FileCode;
  if (['css', 'scss', 'sass', 'less'].includes(ext || '')) return FileCode;
  if (['js', 'jsx', 'ts', 'tsx', 'json'].includes(ext || '')) return FileCode;
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext || '')) return FileImage;
  if (['txt', 'md', 'readme'].includes(ext || '')) return FileText;
  return File;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const WebFileManager = ({ files, onChange }: WebFileManagerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<"file" | "folder">("folder");
  const [createName, setCreateName] = useState("");
  const [createParentId, setCreateParentId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<FileNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadParentId, setUploadParentId] = useState<string | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const openCreateDialog = (type: "file" | "folder", parentId: string | null = null) => {
    setCreateType(type);
    setCreateParentId(parentId);
    setCreateName("");
    setCreateDialogOpen(true);
  };

  const handleCreate = () => {
    if (!createName.trim()) return;

    const newNode: FileNode = {
      id: generateId(),
      name: createName.trim(),
      type: createType,
      ...(createType === "folder" ? { children: [] } : {}),
    };

    if (createParentId === null) {
      onChange([...files, newNode]);
    } else {
      const addToParent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === createParentId && node.type === "folder") {
            return { ...node, children: [...(node.children || []), newNode] };
          }
          if (node.children) {
            return { ...node, children: addToParent(node.children) };
          }
          return node;
        });
      };
      onChange(addToParent(files));
    }

    setCreateDialogOpen(false);
    if (createParentId) {
      setExpandedFolders((prev) => new Set(prev).add(createParentId));
    }
  };

  const handleUploadClick = (parentId: string | null = null) => {
    setUploadParentId(parentId);
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const newNodes: FileNode[] = Array.from(uploadedFiles).map((file) => ({
      id: generateId(),
      name: file.name,
      type: "file" as const,
      file,
    }));

    if (uploadParentId === null) {
      onChange([...files, ...newNodes]);
    } else {
      const addToParent = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === uploadParentId && node.type === "folder") {
            return { ...node, children: [...(node.children || []), ...newNodes] };
          }
          if (node.children) {
            return { ...node, children: addToParent(node.children) };
          }
          return node;
        });
      };
      onChange(addToParent(files));
      setExpandedFolders((prev) => new Set(prev).add(uploadParentId));
    }

    e.target.value = "";
  };

  const handleDeleteClick = (node: FileNode) => {
    setNodeToDelete(node);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!nodeToDelete) return;

    const removeNode = (nodes: FileNode[]): FileNode[] => {
      return nodes
        .filter((node) => node.id !== nodeToDelete.id)
        .map((node) => {
          if (node.children) {
            return { ...node, children: removeNode(node.children) };
          }
          return node;
        });
    };

    onChange(removeNode(files));
    setDeleteDialogOpen(false);
    setNodeToDelete(null);
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const Icon = node.type === "folder" ? Folder : getFileIcon(node.name);

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/50 group transition-colors`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {node.type === "folder" ? (
            <button
              type="button"
              onClick={() => toggleFolder(node.id)}
              className="p-0.5 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}
          
          <Icon className={`w-4 h-4 ${node.type === "folder" ? "text-primary" : "text-muted-foreground"}`} />
          <span className="flex-1 text-sm truncate">{node.name}</span>
          
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
            {node.type === "folder" && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => openCreateDialog("folder", node.id)}
                  title="New Folder"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => openCreateDialog("file", node.id)}
                  title="New File"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleUploadClick(node.id)}
                  title="Upload Files"
                >
                  <Upload className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={() => handleDeleteClick(node)}
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        
        {node.type === "folder" && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => openCreateDialog("folder")}
          className="gap-1.5"
        >
          <FolderPlus className="w-4 h-4" />
          New Folder
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => openCreateDialog("file")}
          className="gap-1.5"
        >
          <FilePlus className="w-4 h-4" />
          New File
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleUploadClick(null)}
          className="gap-1.5"
        >
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
      </div>

      {/* File Tree */}
      <div className="border border-border/50 rounded-xl bg-muted/20 min-h-[200px] max-h-[400px] overflow-auto">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <Folder className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No files yet</p>
            <p className="text-xs">Create folders or upload files to get started</p>
          </div>
        ) : (
          <div className="p-2">
            {files.map((node) => renderNode(node))}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Create New {createType === "folder" ? "Folder" : "File"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder={createType === "folder" ? "Folder name" : "File name (e.g., index.html)"}
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!createName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Delete ${nodeToDelete?.type === "folder" ? "Folder" : "File"}`}
        description={`Are you sure you want to delete "${nodeToDelete?.name}"?${
          nodeToDelete?.type === "folder" ? " This will also delete all contents inside." : ""
        }`}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
