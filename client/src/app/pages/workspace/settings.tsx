import useWorkspacesStore from "@/lib/store/workspace-store";
import { useGetWorkspaceSettings } from "@/lib/data/queries/workspace-queries";
import { SelectSeparator } from "@/components/ui/select";
import HeaderSettings from "@/components/settings/header.settings";
import BarSettings from "@/components/settings/bar.settings";

const SettingsPage = () => {
  const { currentWorkspace } = useWorkspacesStore();
  const {
    data: workspaceSettings,
    isLoading,
    isError,
  } = useGetWorkspaceSettings(currentWorkspace?.id || "");

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (isError || !workspaceSettings)
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load settings.
      </div>
    );

  // {
  //   info: {
  //     name: "cosha";
  //     plan: "free";
  //     ownerName: "Kaushik";
  //     ownerImage: "https://i.pinimg.com/736x/9e/4e/30/9e4e301b8a59bad2c6bcbf7a0193ee82.jpg";
  //     ownerEmail: "kaushikx304@gmail.com";
  //     ownerCreatedAt: "2025-04-12T07:07:05.100Z";
  //     createdAt: "2025-04-12T08:18:44.558Z";
  //   };
  //   settings: {
  //     maxLabs: 3;
  //     maxWorkspaceUsers: 0;
  //     allowWorkspaceInvites: false;
  //     visibility: "public";
  //     allowGithubSync: false;
  //   };
  //   members: [
  //     {
  //       id: "0d85b440-fa00-479b-bcd7-cf948bcce1ce";
  //       name: "Kaushik";
  //       image: "https://i.pinimg.com/736x/9e/4e/30/9e4e301b8a59bad2c6bcbf7a0193ee82.jpg";
  //       email: "kaushikx304@gmail.com";
  //       joinedAt: "2025-04-12T08:18:44.655Z";
  //       role: "Owner";
  //     }
  //   ];
  // };

  //   const { info, settings, members } = workspaceSettings;

  console.log("Workspace Settings:", workspaceSettings);

  return (
    <div className="w-full flex flex-col p-6 pt-16 gap-5 overflow-y-scroll">
      <SelectSeparator className="bg-neutral-800 w-full" />
      <HeaderSettings
        title="Information"
        description="This section provides details about your workspace, including the name, plan, owner, and creation dates. You can view and manage your workspace information here."
      />
      <div className="grid grid-cols-2 w-full gap-4">
        <BarSettings
          title={"Workspace Name"}
          description="The name of your workspace. This is how your workspace will be identified."
          value={workspaceSettings.info.name}
        />
        <BarSettings
          title={"Plan"}
          description="The current plan of your workspace. This determines the features and limits available to you."
          value={workspaceSettings.info.plan}
        />
        <BarSettings
          title={"Owner Name"}
          description="The name of the owner of this workspace."
          value={workspaceSettings.info.ownerName}
        />
        <BarSettings
          title={"Owner Email"}
          description="The email address of the owner of this workspace."
          value={workspaceSettings.info.ownerEmail}
        />
        <BarSettings
          title={"Owner Created At"}
          description="The date when the owner account was created."
          value={new Date(
            workspaceSettings.info.ownerCreatedAt
          ).toLocaleDateString()}
        />
        <BarSettings
          title={"Workspace Created At"}
          description="The date when this workspace was created."
          value={new Date(
            workspaceSettings.info.createdAt
          ).toLocaleDateString()}
        />
      </div>
      <SelectSeparator className="bg-neutral-800 w-full" />
      <HeaderSettings
        title="Settings Overview"
        description="This section provides an overview of your workspace settings, including the current plan, owner details, and creation dates. You can manage your workspace settings here."
      />
      <div className="grid grid-cols-2 w-full gap-4">
        <BarSettings
          title={"Maximum Labs"}
          description="The maximum number of labs allowed in this workspace. This limit is set based on your current plan."
          value={workspaceSettings.settings.maxLabs}
        />
        <BarSettings
          title={"Maximum Workspace Users"}
          description="The maximum number of users allowed in this workspace. This limit is set based on your current plan."
          value={workspaceSettings.settings.maxWorkspaceUsers}
        />
        <BarSettings
          title={"Allow Workspace Invites"}
          description="Enable or disable the ability for members to invite others to this workspace."
          value={workspaceSettings.settings.allowWorkspaceInvites}
        />
        <BarSettings
          title={"Visibility"}
          description="The visibility of this workspace. Public workspaces are visible to everyone, while private workspaces are only accessible to invited members."
          value={workspaceSettings.settings.visibility}
        />
        <BarSettings
          title={"Allow GitHub Sync"}
          description="Enable or disable synchronization with GitHub repositories. This allows you to link your workspace with GitHub for easier management of code and projects."
          value={workspaceSettings.settings.allowGithubSync}
        />
      </div>
      <SelectSeparator className="bg-neutral-800 w-full" />
    </div>
  );
};

export default SettingsPage;
