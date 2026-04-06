'use client'
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";

export default function IconLoader() {
    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: 1300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
            }}
        >
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
                <Image
                    src="/icons/icon.svg"
                    alt="Loading"
                    width={80}
                    height={80}
                    priority
                />
            </motion.div>
        </Box>
    );
}