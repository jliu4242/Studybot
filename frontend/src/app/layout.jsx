import "./globals.css";
import Providers from "./providers";
export const metadata = {
    title: "StudyBot",
    description: "StudyBot question generator frontend",
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>);
}
