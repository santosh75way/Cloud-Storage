import {
    Box,
    Container,
    Typography,
    Paper,
    Stack,
} from "@mui/material";
import {
    LockOutlined,
    BoltOutlined,
    CloudSyncOutlined,
} from "@mui/icons-material";

const features = [
    {
        icon: <LockOutlined />,
        title: "Secure",
        description: "End-to-end encryption for all your sensitive data and files.",
        gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
        bgColor: "#EEF2FF",
    },
    {
        icon: <BoltOutlined />,
        title: "Fast",
        description: "Optimized performance for quick uploads and lightning-fast downloads.",
        gradient: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
        bgColor: "#F5F3FF",
    },
    {
        icon: <CloudSyncOutlined />,
        title: "Anywhere",
        description: "Access your files from any device, anywhere in the world.",
        gradient: "linear-gradient(135deg, #3B82F6, #60A5FA)",
        bgColor: "#EFF6FF",
    },
];

export default function About() {
    return (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
            <Box sx={{ textAlign: "center", mb: 8, animation: "fadeInUp 0.5s ease-out" }}>
                <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 2,
                        fontSize: { xs: "2rem", md: "3rem" },
                    }}
                >
                    About CloudVault
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    fontWeight={400}
                    sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.7 }}
                >
                    Secure, seamless, and stunning cloud storage for all your files.
                    Built with a focus on speed, security, and a premium user experience.
                </Typography>
            </Box>

            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={3}
                sx={{ justifyContent: "center" }}
            >
                {features.map((feature, index) => (
                    <Paper
                        key={feature.title}
                        elevation={0}
                        sx={{
                            flex: 1,
                            p: 4,
                            borderRadius: 4,
                            border: "1px solid #E2E8F0",
                            textAlign: "center",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                            cursor: "default",
                            "&:hover": {
                                transform: "translateY(-6px)",
                                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
                                borderColor: "transparent",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                background: feature.gradient,
                                borderRadius: 3,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                mx: "auto",
                                mb: 3,
                                boxShadow: `0 4px 14px ${feature.bgColor}`,
                            }}
                        >
                            {feature.icon}
                        </Box>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>
                            {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {feature.description}
                        </Typography>
                    </Paper>
                ))}
            </Stack>
        </Container>
    );
}
