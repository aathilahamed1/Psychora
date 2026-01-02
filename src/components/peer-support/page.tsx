
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/contexts/i18n';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Flag, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
import { BackButton } from '@/components/back-button';


interface Post {
  id: number;
  content: string;
  author: string;
  timestamp: string;
  reported?: boolean;
}

export default function PeerSupportPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, author: 'Anonymous', content: 'Feeling really overwhelmed with exams coming up. Any tips?', timestamp: '10:30 AM', reported: false },
    { id: 2, author: 'Anonymous', content: 'Just wanted to say that this forum is a great idea. It feels good to know we\'re not alone.', timestamp: '11:15 AM', reported: false },
  ]);
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim() === '') return;

    const post: Post = {
      id: posts.length + 1,
      content: newPost,
      author: 'Anonymous',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      reported: false,
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleReport = (postId: number) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, reported: true } : p));
    toast({
        title: t('peer.support.report.toast.title'),
        description: t('peer.support.report.toast.description'),
    })
  }

  const handleDelete = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast({
        title: t('peer.support.delete.toast.title'),
        description: t('peer.support.delete.toast.description'),
    })
  }
  
  const canModerate = user?.role === 'Moderator' || user?.role === 'Admin' || user?.role === 'Super Admin';

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-8 relative">
      <BackButton />
      <div className="text-center pt-12 sm:pt-0">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('peerSupport.title')}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {t('peerSupport.description')}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="glassmorphic-card">
          <CardContent className="p-6">
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={t('peer.support.sharePlaceholder')}
                className="min-h-[100px] bg-transparent"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!newPost.trim()}>
                  {t('peer.support.post')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="glassmorphic-card">
                <CardContent className="p-6 flex gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-semibold text-foreground">
                                {post.author}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {post.timestamp}
                            </p>
                        </div>
                         <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleReport(post.id)} aria-label={t('peer.support.report.label')}>
                                <Flag className={cn("h-4 w-4", post.reported ? 'text-destructive fill-destructive' : 'text-muted-foreground')} />
                            </Button>
                            {canModerate && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(post.id)} aria-label={t('peer.support.delete.label')}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                         </div>
                    </div>
                    <p className="mt-2 text-foreground/90">{post.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <p>{t('peer.support.noPosts')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

    