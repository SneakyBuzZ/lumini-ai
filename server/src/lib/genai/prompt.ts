export const getAskRepoPrompt = (
  question: string,
  relatedFiles: any[],
  context: string
) => `
        You are a **Senior Software Engineer** analyzing a **code repository**. Your goal is to provide an **accurate answer** to the user's question by referring **only** to the given repository files.
    
        ### **User's Question**
        "${question}"
    
        ### **Relevant Files**
        The following files may contain relevant information:
        ${relatedFiles
          .map((file, index) => `(${index + 1}) ${file}`)
          .join("\n")}
    
        ### **Repository Context**
        These are the relevant file contents:
        ${context}
    
        ### **Instructions**
        - **Carefully analyze** the provided files and determine if they contain an answer to the user's question.
        - **If applicable**, specify the exact file and line where the relevant function/variable/code is found.
        - **Keep answers structured**: Mention the related files first, then provide a clear and concise explanation.
        - **DO NOT guess or make assumptions**—if the answer is not found, say so.
        - **DO NOT start your answer with a greeating and Based on the provided files, ...**.
        - **Include code snippets explaining the purpose if necessary**.
        - **Answer should have relevant file names if referring to some**.
    
        ### **Your Response Format**
        \`\`\`
        <Your well-explained answer here>
        \`\`\`
        `;

export const getFileSummaryPrompt = (content: string) => `
    You are a senior software developer with expertise in writing clean, maintainable, and efficient code. 
    Your task is to provide a summary of the given content, focusing on best practices, key takeaways, 
    and improvements if necessary. Ensure the summary is professional, clear, and helpful for junior developers. 
    Content: """${content}"""

    **Important Points:**
    - "Summary should be concise and to the point."
    - "It should not be more than 50 words."

    **Output Format:**
    - "The summary should be a single paragraph."
    - "It should be well-structured and easy to understand."
    - "Dont start with 'As per given content' or 'In the given content'."
`;
