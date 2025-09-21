
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

// Mock data, as we cannot fetch from Firestore
const mockUsers: User[] = [
  { id: 'student123', name: 'Student User', email: 'student@university.edu', role: 'Student' },
  { id: 'moderator123', name: 'Moderator User', email: 'moderator@university.edu', role: 'Moderator' },
  { id: 'admin456', name: 'Admin User', email: 'admin@university.edu', role: 'Admin' },
  { id: 'superadmin789', name: 'Super Admin User', email: 'superadmin@university.edu', role: 'Super Admin' },
  { id: 'user001', name: 'Alex Doe', email: 'alex.doe@university.edu', role: 'Student' },
  { id: 'user002', name: 'Brenda Smith', email: 'brenda.s@university.edu', role: 'Student' },
  { id: 'user003', name: 'Charles Xavier', email: 'prof.x@university.edu', role: 'Admin' },
];


export function UserManagement() {
    const { toast } = useToast();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        // In a real app, this would be an API call to a server function
        // that updates Firestore. Here, we just update local state.
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        const userEmail = users.find(u => u.id === userId)?.email;
        toast({
            title: "Role Updated",
            description: `Role for ${userEmail} has been changed to ${newRole}.`
        })
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className="dashboard-card" style={{ animationDelay: '0s' }}>
          <CardHeader>
            <CardTitle>Manage User Roles</CardTitle>
            <CardDescription>
              Assign or change roles for users in the system. Only Super Admins can perform this action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
                <Input
                    placeholder="Search by user name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead className="text-right">Change Role</TableHead>
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
                          <SelectItem value="Super Admin" disabled>Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {filteredUsers.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <p>No users found matching your search.</p>
                </div>
            )}
          </CardContent>
        </Card>
      );
}
