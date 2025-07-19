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

export default function AdminPage() {
  const { users, loading, error } = useGetUsers();

  const role = getUserRole();
  if (role !== "admin") return <Navigate to="/" replace />;

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
                    disabled={u.role === "admin"}
                    onClick={() => console.log("TODO: delete user", u.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PageLayout>
  );
}
