"use client";

import { motion } from "framer-motion";

const variants = {
    hidden: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="enter"
            exit="exit"
            transition={{ ease: "linear", duration: 0.25 }}
        >
            {children}
        </motion.div>
    );
}
