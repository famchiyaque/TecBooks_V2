import { Close } from "@mui/icons-material";
import "@/styles/globalNavigation.css";

function Sidebar({ close, activeTab, setActiveTab, navItems }) {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen flex flex-col pt-6 pb-4 select-none relative z-10">
      {/* Brand Header */}
      <div className="flex items-center mb-8 px-4 text-center gap-3 justify-center">
        <img
          src={"/imgs/site-icon-hd.png"}
          className="bg-sky-500 text-white p-2.5 rounded-2xl shadow-sm size-16"
        />
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Novus
          </h1>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mt-0.5 leading-tight">
            Financial
            <br />
            Dashboard
          </p>
        </div>
        <button
          className="nav-toggle-btn"
          onClick={close}
          aria-label="Toggle navigation"
        >
          <Close color="primary" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                isActive
                  ? "bg-sky-100 text-sky-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-sky-600" : "text-gray-500"}
              />
              <span className="leading-tight">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
