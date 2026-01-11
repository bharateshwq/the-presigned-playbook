import React, { useState, Activity } from "react"; // React 19 import
// Note: If you are on an RC/Canary build, you might need: import { unstable_Activity as Activity } from "react";
import { Plus, X, Globe } from "lucide-react";
import PresignedUrlPlaybook from "./PresignedUrlPlaybook";

const DEFAULT_ARCH = "DB_FIRST_EVENTBRIDGE";

const BrowserPlaybook = () => {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      title: `Tab ${1}`,
      architecture: DEFAULT_ARCH,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextId, setNextId] = useState(2);

  const addTab = () => {
    const newTab = {
      id: nextId,
      title: `Tab ${nextId}`,
      architecture: DEFAULT_ARCH,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(nextId);
    setNextId(nextId + 1);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);

    if (id === activeTabId && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <div className="w-full my-8 font-sans">
      <div className="mockup-browser border-base-300 border bg-base-200">
        {/* Browser Toolbar */}
        <div className="mockup-browser-toolbar">
          <div className="flex w-full items-center gap-2 overflow-hidden">
            <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`
                    group relative flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm cursor-pointer select-none transition-colors min-w-[120px] max-w-[300px]
                    ${
                      activeTabId === tab.id
                        ? "bg-base-100 text-base-content font-medium shadow-sm"
                        : "bg-transparent text-base-content/60 hover:bg-base-100/50 hover:text-base-content"
                    }
                  `}
                >
                  <Globe className="w-3 h-3 opacity-70" />
                  <span className="truncate flex-1">{tab.title}</span>
                  <button
                    onClick={(e) => closeTab(e, tab.id)}
                    className={`
                      p-0.5 rounded-md hover:bg-base-200 opacity-0 group-hover:opacity-100 transition-opacity
                      ${activeTabId === tab.id ? "opacity-100" : ""}
                    `}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={addTab}
                className="btn btn-ghost btn-xs btn-square hover:bg-base-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Browser Content Area */}
        <div className="border-t border-base-300 bg-base-100 min-h-[600px] relative">
          {tabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50 p-10">
              <div className="text-4xl">🏜️</div>
              <p>No tabs open</p>
              <button onClick={addTab} className="btn btn-sm btn-primary">
                Open New Tab
              </button>
            </div>
          ) : (
            <div className="p-0 h-full">
              {/* REACT 19 ACTIVITY IMPLEMENTATION:
                  Instead of conditionally rendering just one tab (which destroys state),
                  we render ALL tabs wrapped in <Activity>.
              */}
              {tabs.map((tab) => (
                <Activity
                  key={tab.id}
                  mode={tab.id === activeTabId ? "visible" : "hidden"}
                >
                  {/* We wrap it in a div because <Activity> handles the 'hidden' state,
                    but we need to ensure the layout matches when visible.
                  */}
                  <div className="h-full">
                    <PresignedUrlPlaybook />
                  </div>
                </Activity>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowserPlaybook;
