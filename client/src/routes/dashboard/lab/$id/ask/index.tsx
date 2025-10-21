import { useEffect, useRef, useState } from "react";
import AssistantChat from "@/components/_lab/ask/assistant-chat";
import UserChat from "@/components/_lab/ask/user-chat";
import { LabChat } from "@/lib/types/lab-type";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { getLabChats, getSessionId } from "@/lib/api/lab-api";
import AskForm from "@/components/layout/forms/ask-form";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Sparkles } from "lucide-react";

const dummyInitialChats: LabChat[] = [
  {
    id: "1",
    userId: "user1",
    sessionId: "session1",
    role: "user",
    content: "What is the purpose of this lab?",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    userId: "assistant1",
    sessionId: "session1",
    role: "assistant",
    content:
      "### Overview\nThis lab is designed to help you understand the basics of machine learning. You will work with datasets, build models, and evaluate their performance. \n ## Key Objectives\n- Understand different types of machine learning algorithms.\n- Gain hands-on experience with data preprocessing and model training.\n- Learn how to evaluate model performance using various metrics. \n\n### Getting Started\nTo get started, clone the repository and follow the instructions in the README file. Make sure to set up your environment with the required dependencies. \n ### Code Examples\nHere are some code snippets to help you get started:\n\n``` python\n# Import necessary libraries\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfromsklearn.ensemble import RandomForestClassifier\n\n# Load dataset\ndata = pd.read_csv('data.csv')\n\n# Preprocess data\nX= data.drop('target', axis=1)\ny = data['target']\n\n# Split data\nX_train, X_test, y_train, y_test = train_test_split(X,y, test_size=0.2, random_state=42)\n\n# Train model\nmodel = RandomForestClassifier()\nmodel.fit(X_train, y_train)\n\n#Evaluate model\naccuracy = model.score(X_test, y_test)\nprint(f'Model Accuracy: {accuracy}')```\n\n\nFeel free to reach out if you have any questions or need further assistance!",
    createdAt: "2024-01-01T10:05:00Z",
    updatedAt: "2024-01-01T10:05:00Z",
  },
  {
    id: "3",
    userId: "user1",
    sessionId: "session1",
    role: "user",
    content: "Can you provide more details on data preprocessing?",
    createdAt: "2024-01-01T10:10:00Z",
    updatedAt: "2024-01-01T10:10:00Z",
  },
  {
    id: "4",
    userId: "assistant1",
    sessionId: "session1",
    role: "assistant",
    content:
      "## Data Processing\n\n Certainly! Data preprocessing is a crucial step in the machine learning pipeline. It involves several techniques to clean and prepare your data for modeling. Here are some common preprocessing steps:\n\n- **Handling Missing Values**: You can either remove rows with missing values or impute them using techniques like mean, median, or mode.\n\n- **Encoding Categorical Variables**: Convert categorical variables into numerical format using one-hot encoding or label encoding.\n\n- **Feature Scaling**: Normalize or standardize your features to ensure that they are on the same scale, which can improve model performance.\n\n- **Removing Outliers**: Identify and remove outliers that may skew your model's learning process.\n\n- **Feature Selection**: Select the most relevant features that contribute to the target variable to reduce dimensionality and improve model efficiency.\n\nHere's a code example demonstrating some of these preprocessing steps:\n\n``` python\n# Handling missing values\ndata.fillna(data.mean(), inplace=True)\n\n# Encoding categorical variables\ndata = pdget_dummies(data, columns=['categorical_column'])\n\n# Feature scaling\nfrom sklearn.preprocessing importStandardScaler\nscaler = StandardScaler()\ndata[['feature1', 'feature2']] = scaler.fit_transform(data[['feature1','feature2']])\n\n# Removing outliers using Z-score\nfrom scipy import stats\nimport numpy as np\nz_scores = np.abs(statszscore(data))\ndata = data[(z_scores < 3).all(axis=1)]```\n\n\nFeel free to ask if you need more specific examples or have other questions!",
    createdAt: "2024-01-01T10:15:00Z",
    updatedAt: "2024-01-01T10:15:00Z",
  },
];

export const Route = createFileRoute("/dashboard/lab/$id/ask/")({
  loader: async () => {
    const labId = window.location.pathname.split("/").at(-2);
    if (!labId) return {};
    const sessionId = await getSessionId(labId);
    const chats = await getLabChats(sessionId);
    return {
      sessionId,
      initialChats: [...dummyInitialChats, chats],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { sessionId, initialChats } = useLoaderData({ from: Route.id });
  const [chats, setChats] = useState<LabChat[]>(initialChats || []);
  const [initialMount, setInitialMount] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isStreaming && endRef.current) {
      const behavior = initialMount ? "instant" : "smooth";
      endRef.current.scrollIntoView({ behavior });
      setInitialMount(false);
    }
  }, [chats, initialMount, isStreaming]);

  if (chats.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center px-5 lg:px-10 xl:px-[14rem]">
        <h2 className="text-2xl font-semibold text-center mb-4 -translate-y-10">
          Ask anything to Lumini AI
        </h2>
        <AskForm
          className="-translate-y-10"
          setChats={setChats}
          setStreaming={setIsStreaming}
          sessionId={sessionId}
          isStreaming={isStreaming}
        />
      </div>
    );
  }

  const showLoading = isStreaming && chats[chats.length - 1].role === "user";

  return (
    <div className="relative w-full flex flex-col justify-start items-center h-full">
      <ul
        className="w-full flex-1 flex flex-col justify-start overflow-y-auto py-4 pb-56 px-5 lg:px-10 xl:px-[14rem]"
        style={{ overflowAnchor: "none" }}
      >
        {chats.map((chat) =>
          chat.role === "user" ? (
            <UserChat key={chat.id} chatId={chat.id} content={chat.content} />
          ) : (
            <AssistantChat
              key={chat.id}
              chatId={chat.id}
              content={chat.content}
            />
          )
        )}
        {showLoading && (
          <div className="flex items-center gap-2 mt-4 text-midnight-500 self-start">
            <Sparkles className="size-4" />
            <TextShimmer>Lumini AI is typing your response...</TextShimmer>
          </div>
        )}
        <div ref={endRef} />
      </ul>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="px-5 lg:px-10 xl:px-[14rem]">
          <div className="w-full bg-midnight-300 pb-2 rounded-t-3xl flex flex-col justify-center">
            <AskForm
              setChats={setChats}
              setStreaming={setIsStreaming}
              sessionId={sessionId}
              isStreaming={isStreaming}
            />
            <span className="w-full text-xs text-center tracking-tight text-neutral-600 pt-2">
              Lumini AI can make mistakes. Please verify the information
              provided.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
