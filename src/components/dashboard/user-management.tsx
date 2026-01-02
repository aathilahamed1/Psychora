
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, User, UserRole } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { useI18n } from '@/contexts/i18n';

// Mock data, as we cannot fetch from Firestore
const mockUsers: User[] = [
  { id: 'student123', name: 'Student User', email: 'student@university.edu', role: 'Student' },
  { id: 'moderator123', name: 'Moderator User', email: 'moderator@university.edu', role: 'Moderator' },
  { id: 'admin456', name: 'Admin User', email: 'admin@university.edu', role: 'Admin' },
  { id: 'superadmin789', name: 'Super Admin User', email: 'superadmin@university.edu', role: 'Super Admin' },
  { id: 'user001', name: 'Alex Doe', email: 'alex.doe@university.edu', role: 'Student' },
  { id: 'user002', name: 'Brenda Smith', email: 'brenda.s@university.edu', role: 'Student' },
  { id: 'user003', name: 'Charles Xavier', email: 'prof.x@university.edu', role: 'Student' },
];


export function UserManagement() {
    const { t } = useI18n();
    const { toast } = useToast();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        const adminCount = users.filter(u => u.role === 'Admin').length;
        const moderatorCount = users.filter(u => u.role === 'Moderator').length;
        const targetUser = users.find(u => u.id === userId);

        if (!targetUser) return;

        // Prevent assigning a new Admin if one already exists
        if (newRole === 'Admin' && targetUser.role !== 'Admin' && adminCount >= 1) {
            toast({
                variant: 'destructive',
                title: t('user.management.toast.adminLimit.title'),
                description: t('user.management.toast.adminLimit.description')
            });
            return;
        }

        // Prevent assigning a new Moderator if two already exist
        if (newRole === 'Moderator' && targetUser.role !== 'Moderator' && moderatorCount >= 2) {
            toast({
                variant: 'destructive',
                title: t('user.management.toast.moderatorLimit.title'),
                description: t('user.management.toast.moderatorLimit.description')
            });
            return;
        }

        // Proceed with the role change
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        toast({
            title: t('user.management.toast.roleUpdated.title'),
            description: t('user.management.toast.roleUpdated.description', { email: targetUser.email, role: newRole })
        });
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className="dashboard-card" style={{ animationDelay: '0s' }}>
          <CardHeader>
            <CardTitle>{t('user.management.title')}</CardTitle>
            <CardDescription>
              {t('user.management.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
                <Input
                    placeholder={t('user.management.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('user.management.table.user')}</TableHead>
                  <TableHead>{t('user.management.table.email')}</TableHead>
                  <TableHead>{t('user.management.table.currentRole')}</TableHead>
                  <TableHead className="text-right">{t('user.management.table.changeRole')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'Admin' || user.role === 'Super Admin' ? 'default' : user.role === 'Moderator' ? 'secondary': 'outline'}>
                            {user.role}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={user.role}
                        onValueChange={(newRole) => handleRoleChange(user.id, newRole as UserRole)}
                        disabled={user.role === 'Super Admin' || currentUser?.id === user.id}
                      >
                        <SelectTrigger className="w-[120px] ml-auto">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Moderator">Moderator</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {filteredUsers.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <p>{t('user.management.noUsersFound')}</p>
                </div>
            )}
          </CardContent>
        </Card>
      );
}

    
