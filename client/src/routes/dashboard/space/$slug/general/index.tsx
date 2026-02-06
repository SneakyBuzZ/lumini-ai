import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { getWorkspaceSettings } from "@/lib/api/workspace-api";
import { cn } from "@/utils/cn.util";
import { useGetWorkspaceSettings } from "@/lib/api/queries/app-queries";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { WorkspaceSettingsGeneral } from "@/lib/types/workspace-type";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TriangleAlert } from "lucide-react";

export const Route = createFileRoute("/dashboard/space/$slug/general/")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["workspace-settings", params.slug, "general"],
      queryFn: () => getWorkspaceSettings("general", params.slug),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { pathname } = useLocation();
  const lastSegement = pathname.split("/").pop();
  const isActive = (to: string) => lastSegement === to;

  const { data: general } = useGetWorkspaceSettings(slug, "general");
  return (
    <div className="w-full flex flex-col justify-start items-start bg-midnight-300/70 h-full space-y-10 p-10 overflow-y-auto">
      <div className="w-full flex flex-col space-y-5">
        <h1 className="text-2xl font-semibold">Workspace Settings</h1>
        <div className="flex space-x-6 border-b border-midnight-100 w-full">
          {SETTINGS_LIST.map((setting) => (
            <Link
              key={setting.to}
              to={setting.to}
              className={cn(
                "pb-2 font-medium text-neutral-500 hover:text-neutral-400 transition-colors",
                isActive(setting.to) &&
                  "border-b-2 border-neutral-400 text-neutral-300",
              )}
            >
              {setting.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col space-y-5">
        <div className="flex flex-col px-1">
          <h3 className="text-xl font-semibold text-neutral-400">
            General Details
          </h3>
          <p className="text-md text-neutral-600">
            Update your workspace name, description, logo and other details
            here.
          </p>
        </div>
        {general && <GeneralDetails general={general} />}
      </div>

      <div className="w-full flex flex-col space-y-5">
        <div className="flex flex-col px-1">
          <h3 className="text-xl font-semibold text-neutral-400">
            Preferrences
          </h3>
          <p className="text-md text-neutral-600">
            Set your workspace default language, notification settings and
            visibility options here.
          </p>
        </div>
        {general && <Preferrences general={general} />}
      </div>

      <div className="w-full flex flex-col space-y-5">
        <div className="flex flex-col px-1">
          <h3 className="text-xl font-semibold text-neutral-400">
            Danger Zone
          </h3>
          <p className="text-md text-neutral-600">
            Critical actions for your workspace. Proceed with caution.
          </p>
        </div>
        <DangerZone />
      </div>
    </div>
  );
}

function GeneralDetails({ general }: { general: WorkspaceSettingsGeneral }) {
  return (
    <div className="w-full bg-midnight-200/40 border border-dashed border-midnight-100 rounded-xl">
      <div className="flex justify-between items-center border-b border-dashed border-midnight-100 p-3">
        <span className="font-semibold text-md">Name</span>
        <Input
          className="w-[30rem]"
          value={general?.name || ""}
          onChange={() => {}}
          placeholder="Workspace Name"
        ></Input>
      </div>
      <div className="flex justify-between items-center border-b border-dashed border-midnight-100 p-3">
        <span className="font-semibold text-md">Slug</span>
        <Input
          className="w-[30rem]"
          value={general?.slug || ""}
          onChange={() => {}}
          placeholder="Workspace Slug"
        ></Input>
      </div>
      <div className="flex justify-between items-center border-b border-dashed border-midnight-100 p-4">
        <span className="font-semibold text-md">Logo Url</span>
        <Input
          className="w-[30rem]"
          value={general?.logoUrl || ""}
          onChange={() => {}}
          placeholder="Logo URL"
        ></Input>
      </div>
      <div className="flex justify-between items-center border-b border-dashed border-midnight-100 p-4">
        <span className="font-semibold text-md">Description</span>
        <Textarea
          className="w-[30rem] bg-midnight-200 border-midnight-100 hide-scrollbar"
          value={general?.description || ""}
          onChange={() => {}}
          placeholder="Workspace Description"
        ></Textarea>
      </div>
      <div className="flex justify-end items-center gap-2 p-4">
        <Button variant={"outline"}>Cancel</Button>
        <Button>Save Details</Button>
      </div>
    </div>
  );
}

function Preferrences({ general }: { general: WorkspaceSettingsGeneral }) {
  return (
    <div className="w-full bg-midnight-200/40 border border-dashed border-midnight-100 rounded-xl">
      <div className="flex justify-between items-start border-b border-dashed border-midnight-100">
        <div className="flex flex-col space-y-6 w-80 p-6 py-8">
          <span className="font-semibold text-md">Visibility</span>
          <p className="text-sm text-neutral-500">
            Visibility settings determine who can see your workspace and its
            contents. It is important to choose the right visibility level to
            ensure that your data is accessible to the appropriate audience
            while maintaining privacy and security.
          </p>
          <p className="text-sm text-neutral-500">
            Choose from Public, Private, or Restricted visibility options based
            on your collaboration needs. You can update these settings at any
            time.
          </p>
        </div>

        <RadioGroup
          defaultValue={general.settings.visibility || "public"}
          className="w-[32rem] h-full gap-2 p-6 py-8"
        >
          <div className="flex items-start gap-3 mb-3">
            <RadioGroupItem value="public" id="r1" />
            <div className="flex flex-col gap-2">
              <Label htmlFor="r1" className="text-neutral-200">
                Public
              </Label>
              <p className="text-sm text-neutral-500">
                This is the default visibility setting for your workspace. With
                visibility set to Public, anyone can view and access the
                contents of your workspace without any restrictions. But only
                members you invite can make changes.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <RadioGroupItem value="private" id="r1" />
            <div className="flex flex-col gap-2">
              <Label htmlFor="r1" className="text-neutral-200">
                Private
              </Label>
              <p className="text-sm text-neutral-500">
                With visibility set to Private, only members you explicitly
                invite can view and access the contents of your workspace. This
                setting ensures that your workspace remains confidential and is
                not accessible to anyone outside of your invited members.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RadioGroupItem value="restricted" id="r1" />
            <div className="flex flex-col gap-2">
              <Label htmlFor="r1" className="text-neutral-200">
                Restricted
              </Label>
              <p className="text-sm text-neutral-500">
                The Restricted visibility setting allows you to have more
                control over who can view and access your workspace. With this
                setting, only members you invite can access the workspace, but
                certain parts of the workspace can be made visible to a wider
                audience based on your preferences.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div className="flex justify-between items-start border-b border-dashed border-midnight-100">
        <div className="flex flex-col space-y-6 w-80 p-6 py-8">
          <span className="font-semibold text-md">Language</span>
          <p className="text-sm text-neutral-500">
            Set the default language for your workspace. This language will be
            used for system messages, notifications, and other communications
            within the workspace.
          </p>
        </div>

        <RadioGroup
          defaultValue={general.settings.defaultLanguage || "en"}
          className="w-[32rem] h-full gap-2 p-6 py-8"
        >
          <div className="flex items-start gap-3 mb-3">
            <RadioGroupItem value="en" id="r1" />
            <div className="flex flex-col gap-2">
              <Label htmlFor="r1" className="text-neutral-200">
                English
              </Label>
              <p className="text-sm text-neutral-500">
                English is the default language for your workspace. This
                language will be used for system messages, notifications, and
                other communications within the workspace.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div className="flex justify-between items-start border-b border-dashed border-midnight-100">
        <div className="flex flex-col space-y-6 w-80 p-6 py-8">
          <span className="font-semibold text-md">Notifications</span>
          <p className="text-sm text-neutral-500">
            Enable or disable notifications for your workspace. When
            notifications are enabled, you will receive alerts for important
            updates, messages, and activities within the workspace.
          </p>
        </div>

        <RadioGroup
          defaultValue={
            general.settings.notificationsEnabled ? "enable" : "disable"
          }
          className="w-[32rem] h-full gap-2 p-6 py-8"
        >
          <div className="flex items-start gap-3 mb-3">
            <RadioGroupItem value="enable" id="r1" />
            <div className="flex flex-col gap-2">
              <Label htmlFor="r1" className="text-neutral-200">
                Enable
              </Label>
              <p className="text-sm text-neutral-500">
                Enable notifications to receive alerts for important updates,
                messages, and activities within the workspace.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <RadioGroupItem value="disable" id="r1" />
            <div className="flex flex-col gap-2">
              <Label htmlFor="r1" className="text-neutral-200">
                Disable
              </Label>
              <p className="text-sm text-neutral-500">
                Disable notifications if you prefer not to receive alerts for
                updates, messages, and activities within the workspace.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div className="flex justify-end items-center gap-2 p-4">
        <Button variant={"outline"}>Cancel</Button>
        <Button>Save Details</Button>
      </div>
    </div>
  );
}

function DangerZone() {
  return (
    <div className="w-full bg-red-800/10 border border-dashed border-red-400/20 rounded-xl">
      <div className="flex justify-between items-start">
        <div className="flex flex-col space-y-3 p-6 py-8">
          <div className="flex justify-start items-center gap-2">
            <div className="flex justify-center items-center p-1.5 bg-red-500/60 rounded-lg">
              <TriangleAlert className="size-4 text-white " />
            </div>
            <span className="font-semibold text-lg text-neutral-200">
              Delete Workspace
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Deleting your workspace is a permanent action that cannot be undone.
            This action will remove all data, projects, and settings associated
            with the workspace. Please proceed with caution and ensure that you
            have backed up any important information before confirming the
            deletion.
          </p>
          <Button variant={"destructive"} className="w-40">
            Delete Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}

const SETTINGS_LIST = [
  { name: "General", to: "general" },
  { name: "Integrations", to: "integrations" },
  { name: "Usage", to: "usage" },
];
