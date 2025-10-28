import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import type { Tool } from '@shared/schema';

interface DownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: Tool;
  downloadType: 'primary' | 'mirror';
  onConfirm: () => void;
}

export function DownloadModal({ open, onOpenChange, tool, downloadType, onConfirm }: DownloadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-download">
        <DialogHeader>
          <DialogTitle>Download {tool.title}</DialogTitle>
          <DialogDescription>
            You're about to download this tool. Please consider supporting the creator!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            This tool is provided by the community. By downloading, you agree to use it responsibly.
          </p>
          
          <div className="flex flex-col gap-2">
            <Button 
              className="w-full gap-2" 
              onClick={onConfirm}
              data-testid="button-confirm-download"
            >
              <Download className="h-4 w-4" />
              Confirm Download ({downloadType === 'primary' ? 'Primary' : 'Mirror'})
            </Button>
            
            {tool.donate_url && (
              <Button 
                variant="secondary" 
                className="w-full gap-2"
                asChild
              >
                <a href={tool.donate_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Support Creator
                </a>
              </Button>
            )}
            
            {tool.telegram_url && (
              <Button 
                variant="outline" 
                className="w-full gap-2"
                asChild
              >
                <a href={tool.telegram_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Join Telegram Channel
                </a>
              </Button>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-download"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
