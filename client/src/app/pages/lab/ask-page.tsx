import AskForm from "@/components/forms/ask-form";
import useAnswerStore from "@/lib/store/asnwer-store";

const AskPage = () => {
  const { answers } = useAnswerStore();
  return (
    <div className="w-full flex flex-col justify-center items-center  bg-neutral-100/80 dark:bg-midnight-400 h-full gap-6 ">
      {answers.length > 0 ? (
        <div className="flex flex-col w-11/12 h-full justify-start items-center gap-2 overflow-y-scroll py-20">
          <ul className="list-disc pl-5">
            {answers.map((ans, idx) => (
              <div key={idx} className="space-y-2">
                {/* AI Response */}
                <div className="w-2/3 p-4 rounded-lg shadow-sm">
                  <p className="text-neutral-400 whitespace-pre-line">
                    {ans.answer}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ans.relatedFiles.map((file, fidx) => (
                    <div
                      key={fidx}
                      className="border border-midnight-200 rounded-md p-3 bg-midnight-300 shadow-sm"
                    >
                      <div className="text-sm font-semibold text-gray-700">
                        {file.file}
                      </div>
                      <div className="text-gray-600 mt-1 whitespace-pre-line">
                        {file.summary.slice(0, 100)}...
                      </div>

                      {/* Expandable content */}
                      <details className="mt-2">
                        <summary className="text-blue-600 cursor-pointer text-sm">
                          View raw content
                        </summary>
                        <pre className="mt-2 bg-midnight-100 p-2 text-neutral-400 text-xs overflow-auto max-h-60">
                          {file.content}
                        </pre>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center w-2/3 gap-2">
            <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-400">
              Ask anything to your Repository!
            </h2>
            <p className="text-sm text-neutral-600 text-center">
              This is the page where you can ask anything to your repository.
              You can ask for the latest commits, contributors, issues, pull
              requests, and much more.
            </p>
          </div>
          <div className="flex flex-col justify-start items-center w-2/3 gap-4">
            <AskForm />
          </div>
        </>
      )}
    </div>
  );
};

export default AskPage;
