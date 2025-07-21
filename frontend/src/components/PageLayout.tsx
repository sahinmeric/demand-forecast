import { Container, Typography } from "@mui/material";
import type { ReactNode } from "react";
import Loader from "./Loader";

type Props = {
  title: string;
  children: ReactNode;
  loading?: boolean;
  loadingMessage?: string;
};

const PageLayout = ({
  title,
  children,
  loading = false,
  loadingMessage,
}: Props) => (
  <Container
    maxWidth="lg"
    sx={{
      py: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Typography variant="h4" component="h1" gutterBottom>
      {title}
    </Typography>
    {loading ? (
      <Loader fullHeight message={loadingMessage || "Loading..."} />
    ) : (
      children
    )}
  </Container>
);

export default PageLayout;
