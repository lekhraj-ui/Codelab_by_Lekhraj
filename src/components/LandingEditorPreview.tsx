/** Decorative dual-pane IDE preview for the landing hero. */
export default function LandingEditorPreview() {
  return (
    <div
      className="border border-outline-variant bg-surface-container-lowest overflow-hidden"
      aria-hidden="true"
    >
      {/* Mini chrome bar */}
      <div className="flex items-center justify-between border-b border-outline-variant px-md py-sm bg-surface-container-low">
        <div className="flex items-center gap-xs">
          <span className="h-2 w-2 rounded-full bg-outline-variant" />
          <span className="h-2 w-2 rounded-full bg-outline-variant" />
          <span className="h-2 w-2 rounded-full bg-outline-variant" />
        </div>
        <span className="font-ui-label text-[10px] text-on-surface-variant uppercase tracking-widest">
          problem / 142 · merge-k-lists
        </span>
        <span className="font-code-block text-[11px] text-on-surface-variant">
          Python 3
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[320px] md:min-h-[420px]">
        {/* Problem Statement */}
        <div className="border-b md:border-b-0 md:border-r border-outline-variant p-lg md:p-xl flex flex-col gap-md text-left">
          <span className="font-ui-label text-ui-label text-on-surface-variant uppercase tracking-widest text-[10px]">
            Problem Statement
          </span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Algorithm: Merge K Sorted Lists
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Merge k sorted linked lists and return it as one sorted list.
            Analyze and describe its complexity.
          </p>
          <div className="mt-sm space-y-sm border-t border-outline-variant pt-md">
            <p className="font-ui-label text-[11px] text-on-surface-variant uppercase tracking-widest">
              Example
            </p>
            <p className="font-code-block text-code-block text-on-surface">
              <span className="text-on-surface-variant">Input: </span>
              [1-&gt;4-&gt;5, 1-&gt;3-&gt;4, 2-&gt;6]
            </p>
            <p className="font-code-block text-code-block text-on-surface">
              <span className="text-on-surface-variant">Output: </span>
              1-&gt;1-&gt;2-&gt;3-&gt;4-&gt;4-&gt;5-&gt;6
            </p>
          </div>
        </div>

        {/* Code Editor */}
        <div className="p-lg md:p-xl flex flex-col gap-md text-left bg-surface-container-low/40">
          <div className="flex items-center justify-between gap-md">
            <span className="font-ui-label text-ui-label text-on-surface-variant uppercase tracking-widest text-[10px]">
              Code Editor
            </span>
            <span className="bg-primary text-on-primary px-md py-sm font-ui-label text-[11px] pointer-events-none select-none">
              Run Code
            </span>
          </div>

          <div className="flex-1 border border-outline-variant bg-surface-container-lowest p-md md:p-lg font-code-block text-[13px] md:text-code-block leading-relaxed min-h-[180px]">
            <pre className="m-0 whitespace-pre overflow-x-auto">
              <code>
                <span className="text-code-keyword">def</span>
                <span className="text-code-fg"> mergeKLists(lists):</span>
                {"\n"}
                <span className="text-code-comment">
                  {"    "}# Your code here...
                </span>
                {"\n"}
                <span className="text-code-fg">{"    "}pass</span>
              </code>
            </pre>
          </div>

          <div className="flex justify-end">
            <span className="bg-primary text-on-primary px-md py-sm font-ui-label text-[11px] pointer-events-none select-none">
              Run Code
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
