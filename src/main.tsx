import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app/App.tsx";
import { AdminLayout } from "./app/admin/AdminLayout.tsx";
import { ProjectsManager } from "./app/admin/pages/ProjectsManager.tsx";
import { SkillsManager } from "./app/admin/pages/SkillsManager.tsx";
import { ProfileManager } from "./app/admin/pages/ProfileManager.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/my-admin-dashboard-241100" element={<AdminLayout />}>
        <Route index element={<ProjectsManager />} />
        <Route path="skills" element={<SkillsManager />} />
        <Route path="profile" element={<ProfileManager />} />
      </Route>
    </Routes>
  </BrowserRouter>
);