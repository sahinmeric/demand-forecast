import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Button,
} from "@mui/material";
import { getUserRole } from "../auth";
import { Navigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { useGetUsers } from "../hooks/useGetUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";
import ConfirmDialog from "../components/ConfirmDialog";
import { useConfirmDialog } from "../hooks/useConfirmDialog";

export default function AdminPage() {
  const { users, loading, error, refetch } = useGetUsers();
  const { deleteUser, loading: deleting, error: deleteError } = useDeleteUser();
  const { confirm, isOpen, message, title, handleConfirm, handleCancel } =
    useConfirmDialog();
  const role = getUserRole();
  if (role !== "admin") return <Navigate to="/" replace />;

  const handleDelete = (id: number) => {
    confirm({
      message: "Are you sure you want to delete this user?",
      title: "Confirm Deletion",
      onConfirm: async () => {
        const success = await deleteUser(id);
        if (success) await refetch();
      },
    });
  };

  return (
    <PageLayout
      title="User Management"
      loading={loading}
      loadingMessage="Loading users..."
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {deleteError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {deleteError}
        </Alert>
      )}

      {!loading && !error && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled={u.role === "admin" || deleting}
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <ConfirmDialog
        open={isOpen}
        message={message}
        title={title}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </PageLayout>
  );
}
