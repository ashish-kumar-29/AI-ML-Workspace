export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-8">
        AI ML Workspace
      </h1>

      <nav className="space-y-4">

        <button className="w-full text-left p-3 rounded-lg bg-blue-600">
          📤 Upload
        </button>

        <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700">
          📊 Dataset Intelligence
        </button>

        <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700">
          🤖 AI Recommendation
        </button>

        <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700">
          🧪 Experiment Lab
        </button>

        <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700">
          💬 AI Chat
        </button>

        <button className="w-full text-left p-3 rounded-lg hover:bg-slate-700">
          📄 Report
        </button>

      </nav>

    </aside>
  );
}