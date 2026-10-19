import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  demoCustomers,
  demoOrders,
  demoTasks,
  orderStatuses,
  type BatteryOrder,
  type CrmTask,
  type Customer,
  type CustomerType,
  type OrderStatus,
} from "./crm-data";

type Page = "داشبورد" | "مشتریان" | "پرونده مشتری" | "وظایف و تقویم" | "سفارش‌ها" | "دستیار هوشمند";

type IconName =
  | "grid"
  | "users"
  | "user"
  | "check"
  | "chart"
  | "box"
  | "spark"
  | "settings"
  | "search"
  | "bell"
  | "plus"
  | "arrow"
  | "phone"
  | "calendar"
  | "clock"
  | "wallet"
  | "file"
  | "more"
  | "chevron"
  | "filter"
  | "message"
  | "mail"
  | "location"
  | "edit"
  | "target";

const iconPaths: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  check: <><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
  chart: <><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-8"/></>,
  box: <><path d="m21 8-9 5-9-5"/><path d="m3 8 9-5 9 5v8l-9 5-9-5Z"/><path d="M12 13v8"/></>,
  spark: <><path d="m12 3-1.8 4.2L6 9l4.2 1.8L12 15l1.8-4.2L18 9l-4.2-1.8Z"/><path d="m5 15-.9 2.1L2 18l2.1.9L5 21l.9-2.1L8 18l-2.1-.9Z"/><path d="m19 14-.9 2.1L16 17l2.1.9L19 20l.9-2.1L22 17l-2.1-.9Z"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.12.37.34.7.65.94.3.24.68.37 1.06.37H21v4h-.09c-.65 0-1.24.38-1.51.69Z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  arrow: <><path d="M19 12H5M12 19l-7-7 7-7"/></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z"/>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  wallet: <><path d="M20 7V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h16v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6"/><path d="M16 14h2"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  filter: <path d="M4 5h16M7 12h10M10 19h4"/>,
  message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>;
}

const navItems: { label: string; icon: IconName }[] = [
  { label: "داشبورد", icon: "grid" },
  { label: "مشتریان", icon: "users" },
  { label: "وظایف و تقویم", icon: "check" },
  { label: "مسیر فروش", icon: "chart" },
  { label: "سفارش‌ها", icon: "box" },
  { label: "دستیار هوشمند", icon: "spark" },
];

const pageDetails: Record<Page, { title: string; subtitle: string }> = {
  "داشبورد": { title: "صبح بخیر، احسان", subtitle: "امروز ۸ پیگیری و ۳ تصمیم مهم در انتظار شماست." },
  "مشتریان": { title: "مشتریان", subtitle: "مدیریت اطلاعات و ارتباط با مشتریان آتا" },
  "پرونده مشتری": { title: "پرونده مشتری", subtitle: "نمای کامل ارتباطات، فروش و فعالیت‌های مشتری" },
  "وظایف و تقویم": { title: "وظایف و پیگیری‌ها", subtitle: "برنامه‌ریزی و کنترل فعالیت‌های تیم فروش" },
  "سفارش‌ها": { title: "سفارش‌های باتری", subtitle: "کنترل سفارش از ثبت اولیه تا تحویل به مشتری" },
  "دستیار هوشمند": { title: "دستیار هوشمند آتا", subtitle: "پیشنهادهای نمایشی برای برنامه‌ریزی و پیگیری بهتر" },
};

function Header({ page, onQuickAdd }: { page: Page; onQuickAdd: () => void }) {
  const details = pageDetails[page];
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">سه‌شنبه، ۲۴ مهر ۱۴۰۳</p>
        <h1>{details.title}</h1>
        <p className="subtitle">{details.subtitle}</p>
      </div>
      <div className="header-actions">
        <label className="search-box">
          <Icon name="search" size={18} />
          <input aria-label="جست‌وجو" placeholder="جست‌وجوی مشتری، سفارش..." />
          <kbd>⌘ K</kbd>
        </label>
        <button className="icon-button" aria-label="اعلان‌ها"><Icon name="bell" size={20}/><span className="notification-dot"/></button>
        <button className="primary-button" onClick={onQuickAdd}><Icon name="plus" size={18}/> ثبت سریع</button>
      </div>
    </header>
  );
}

function Sidebar({ page, setPage, openTasks }: { page: Page; setPage: (page: Page) => void; openTasks: number }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">آ</div>
        <div><strong>آتا</strong><span>سامانه مدیریت ارتباط</span></div>
      </div>
      <nav>
        <p className="nav-heading">فضای کاری</p>
        {navItems.map((item) => (
          <button key={item.label} onClick={() => item.label !== "مسیر فروش" && setPage(item.label as Page)} className={`nav-item ${page === item.label || (page === "پرونده مشتری" && item.label === "مشتریان") ? "active" : ""}`}>
            <Icon name={item.icon} size={20}/><span>{item.label}</span>
            {item.label === "وظایف و تقویم" && <b>{openTasks}</b>}
            {item.label === "دستیار هوشمند" && <i>جدید</i>}
          </button>
        ))}
        <div className="nav-separator"/>
        <button className="nav-item"><Icon name="settings" size={20}/><span>تنظیمات و دسترسی</span></button>
      </nav>
      <div className="assistant-card">
        <div className="assistant-icon"><Icon name="spark" size={20}/></div>
        <strong>دستیار آتا</strong>
        <p>برای امروز چه برنامه‌ای دارم؟</p>
        <button onClick={() => setPage("دستیار هوشمند")}>شروع گفت‌وگو <Icon name="arrow" size={15}/></button>
      </div>
      <div className="profile">
        <div className="avatar">اب</div>
        <div><strong>احسان باقری</strong><span>مدیر فروش</span></div>
        <Icon name="more" size={20}/>
      </div>
    </aside>
  );
}

function StatCard({ title, value, detail, icon, tone, trend }: { title: string; value: string; detail: string; icon: IconName; tone: string; trend?: string }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon name={icon} size={21}/></div>
      <div className="stat-title">{title}<button aria-label="جزئیات"><Icon name="more" size={18}/></button></div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-detail">{trend && <span>{trend}</span>} {detail}</div>
    </article>
  );
}

const chartPoints = "0,145 45,128 90,136 135,92 180,106 225,68 270,75 315,38 360,58 405,20 450,34 500,5";

function SalesChart() {
  return (
    <section className="panel chart-panel">
      <div className="panel-head">
        <div><h2>روند فروش</h2><p>عملکرد شش ماه اخیر</p></div>
        <div className="chart-meta"><span><i className="legend actual"/>فروش قطعی</span><span><i className="legend target"/>هدف فروش</span><button className="select-button">شش ماه اخیر <Icon name="chevron" size={15}/></button></div>
      </div>
      <div className="chart-summary"><strong>۱۲٫۴ میلیارد</strong><span>تومان</span><b>٪۱۸٫۲ +</b><small>نسبت به دوره قبل</small></div>
      <div className="chart-wrap">
        <div className="y-axis"><span>۵ میلیارد</span><span>۳٫۷۵</span><span>۲٫۵</span><span>۱٫۲۵</span><span>۰</span></div>
        <svg viewBox="0 0 500 160" preserveAspectRatio="none" className="line-chart" aria-label="نمودار فروش">
          <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#12a594" stopOpacity=".22"/><stop offset="1" stopColor="#12a594" stopOpacity="0"/></linearGradient></defs>
          <g className="grid-lines"><line x1="0" y1="5" x2="500" y2="5"/><line x1="0" y1="43" x2="500" y2="43"/><line x1="0" y1="81" x2="500" y2="81"/><line x1="0" y1="119" x2="500" y2="119"/><line x1="0" y1="157" x2="500" y2="157"/></g>
          <polyline points="0,132 45,118 90,106 135,97 180,89 225,77 270,65 315,55 360,44 405,31 450,19 500,8" className="target-line"/>
          <polygon points={`${chartPoints} 500,160 0,160`} fill="url(#area)"/>
          <polyline points={chartPoints} className="actual-line"/>
          {[["135","92"],["225","68"],["315","38"],["405","20"]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="4" className="chart-dot"/>)}
        </svg>
        <div className="x-axis"><span>اردیبهشت</span><span>خرداد</span><span>تیر</span><span>مرداد</span><span>شهریور</span><span>مهر</span></div>
      </div>
    </section>
  );
}

const tasks = [
  { time: "۰۹:۳۰", title: "تماس با شرکت آریا صنعت", text: "پیگیری پیش‌فاکتور باتری لیفتراک", type: "تماس", color: "teal" },
  { time: "۱۱:۰۰", title: "جلسه با پارس خودرو", text: "بررسی نیاز سه‌ماهه چهارم", type: "جلسه", color: "blue" },
  { time: "۱۳:۳۰", title: "ارسال پیشنهاد قیمت", text: "صنایع غذایی سپهر", type: "وظیفه", color: "orange" },
  { time: "۱۶:۰۰", title: "کنترل سفارش ۲۴۸۱", text: "تأیید نهایی واحد کنترل کیفیت", type: "سفارش", color: "purple" },
];

function TodayTasks() {
  return (
    <section className="panel tasks-panel">
      <div className="panel-head"><div><h2>برنامه امروز</h2><p>۸ فعالیت برنامه‌ریزی‌شده</p></div><button className="link-button">مشاهده تقویم <Icon name="arrow" size={15}/></button></div>
      <div className="task-list">
        {tasks.map((task) => <div className="task-row" key={task.time}>
          <div className="task-time">{task.time}<span/></div>
          <div className={`task-marker ${task.color}`}><Icon name={task.type === "تماس" ? "phone" : task.type === "جلسه" ? "users" : task.type === "سفارش" ? "box" : "check"} size={17}/></div>
          <div className="task-copy"><strong>{task.title}</strong><span>{task.text}</span></div>
          <span className={`tag ${task.color}`}>{task.type}</span>
          <button className="more-button"><Icon name="more" size={18}/></button>
        </div>)}
      </div>
      <button className="full-button"><Icon name="plus" size={16}/> افزودن فعالیت جدید</button>
    </section>
  );
}

function Dashboard({ setPage, openQuickAdd }: { setPage: (page: Page) => void; openQuickAdd: () => void }) {
  return (
    <>
      <Header page="داشبورد" onQuickAdd={openQuickAdd}/>
      <main className="content">
        <div className="insight-banner">
          <div className="insight-icon"><Icon name="spark" size={22}/></div>
          <div><strong>پیشنهاد دستیار آتا</strong><p>سه مشتری با احتمال خرید بالا، بیش از ۵ روز است که پیگیری نشده‌اند.</p></div>
          <button onClick={() => setPage("دستیار هوشمند")}>مشاهده پیشنهادها <Icon name="arrow" size={16}/></button>
          <button className="close-button">×</button>
        </div>
        <section className="stats-grid">
          <StatCard title="فروش این ماه" value="۲٫۴۸ میلیارد" detail="نسبت به ماه قبل" trend="٪۱۲٫۵ +" icon="wallet" tone="teal"/>
          <StatCard title="پیگیری‌های امروز" value="۸ مورد" detail="۳ مورد اولویت بالا" icon="phone" tone="blue"/>
          <StatCard title="کارهای عقب‌افتاده" value="۵ مورد" detail="نیازمند رسیدگی" icon="clock" tone="orange"/>
          <StatCard title="سفارش‌های متوقف" value="۳ سفارش" detail="ارزش ۴۸۰ میلیون" icon="box" tone="red"/>
        </section>
        <div className="dashboard-grid"><SalesChart/><TodayTasks/></div>
        <section className="panel customers-panel">
          <div className="panel-head"><div><h2>مشتریان نیازمند توجه</h2><p>بر اساس اولویت و زمان آخرین تعامل</p></div><button className="link-button" onClick={() => setPage("مشتریان")}>مشاهده همه مشتریان <Icon name="arrow" size={15}/></button></div>
          <div className="customer-table">
            <div className="table-head"><span>مشتری</span><span>آخرین تعامل</span><span>فرصت فروش</span><span>مسئول پیگیری</span><span>وضعیت</span><span/></div>
            {[
              ["صنایع آریا شرق","حسین محمودی","۶ روز پیش","۴۲۰ میلیون","سارا احمدی","پیگیری فوری","danger","ص"],
              ["پارس تجهیز البرز","نگار شریفی","۳ روز پیش","۲۸۵ میلیون","امیر نادری","مذاکره","warning","پ"],
              ["توسعه انرژی پویا","رضا عزیزی","امروز","۱۹۰ میلیون","علی رضایی","پیش‌فاکتور","info","ت"],
            ].map((row) => <button className="table-row" key={row[0]}>
              <span className="customer-name"><b className="mini-avatar">{row[7]}</b><span><strong>{row[0]}</strong><small>{row[1]}</small></span></span>
              <span>{row[2]}</span><span>{row[3]}</span><span className="assignee"><b>{row[4].slice(0,1)}</b>{row[4]}</span><span><i className={`status ${row[6]}`}>{row[5]}</i></span><Icon name="chevron" size={17}/>
            </button>)}
          </div>
        </section>
      </main>
    </>
  );
}

function CustomerProfile({ customer, onBack, onEdit, orders }: { customer: Customer; onBack: () => void; onEdit: () => void; orders: BatteryOrder[] }) {
  const [tab, setTab] = useState("نمای کلی");
  return (
    <>
      <Header page="پرونده مشتری" onQuickAdd={onEdit}/>
      <main className="content customer-page">
        <button className="back-link" onClick={onBack}><Icon name="chevron" size={17}/> بازگشت به فهرست مشتریان</button>
        <section className="profile-hero">
          <div className="company-avatar">{customer.name.slice(0, 1)}</div>
          <div className="company-main"><div className="company-title"><h2>{customer.name}</h2><span className={`status ${customer.status === "فعال" ? "success" : "danger"}`}>{customer.status === "فعال" ? "مشتری فعال" : "نیازمند پیگیری"}</span><span className="priority">{customer.type}</span></div><p>{customer.industry}</p><div className="company-meta"><span><Icon name="location" size={16}/>{customer.location}</span><span><Icon name="calendar" size={16}/> مشتری نمونه CRM آتا</span><span><Icon name="user" size={16}/> مسئول: {customer.owner}</span></div></div>
          <div className="profile-actions"><button className="outline-button" onClick={onEdit}><Icon name="edit" size={17}/> ویرایش</button><button className="primary-button"><Icon name="plus" size={17}/> ثبت تعامل</button><button className="icon-button"><Icon name="more" size={20}/></button></div>
        </section>
        <div className="profile-tabs">
          {["نمای کلی","تعاملات","فرصت‌های فروش","پیش‌فاکتورها","سفارش‌ها","وظایف","امور مالی"].map(item => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}{item === "وظایف" && <b>۳</b>}</button>)}
        </div>
        {tab !== "نمای کلی" ? <EmptyTab tab={tab}/> : <div className="profile-layout">
          <div className="profile-primary">
            <section className="panel profile-kpis">
              <div><span>کل فروش</span><strong>۱٫۸۴ میلیارد</strong><small>تومان</small></div>
              <div><span>سفارش‌های مرتبط</span><strong>{orders.length} سفارش</strong><small>ثبت‌شده در نمونه</small></div>
              <div><span>مانده حساب</span><strong>۸۵ میلیون</strong><small className="danger-text">سررسید گذشته</small></div>
              <div><span>میانگین زمان خرید</span><strong>۴۵ روز</strong><small>از اولین تماس</small></div>
            </section>
            <section className="panel">
              <div className="panel-head"><div><h2>آخرین تعاملات</h2><p>تاریخچه ارتباط با مشتری</p></div><button className="link-button">مشاهده همه <Icon name="arrow" size={15}/></button></div>
              <div className="timeline">
                {[
                  ["phone","تماس تلفنی با حسین محمودی","پیگیری پیش‌فاکتور باتری لیفتراک؛ مشتری درخواست بازبینی زمان تحویل را داشت.","امروز، ساعت ۱۰:۲۵","teal"],
                  ["file","ارسال پیش‌فاکتور شماره ۲۳۸۴","پیش‌فاکتور ۴۲۰ میلیون تومانی برای ۲۴ دستگاه باتری ارسال شد.","۲۲ مهر ۱۴۰۳","blue"],
                  ["users","جلسه حضوری در دفتر مشتری","بررسی نیازهای فصل پاییز و معرفی سری جدید محصولات صنعتی.","۱۸ مهر ۱۴۰۳","purple"],
                ].map(([icon,title,text,date,color], index) => <div className="timeline-item" key={title}>
                  <div className={`timeline-icon ${color}`}><Icon name={icon as IconName} size={18}/></div>
                  {index < 2 && <span className="timeline-line"/>}
                  <div><strong>{title}</strong><p>{text}</p><small><Icon name="clock" size={14}/>{date} · ثبت‌شده توسط سارا احمدی</small></div>
                  <button className="more-button"><Icon name="more" size={18}/></button>
                </div>)}
              </div>
              <button className="full-button"><Icon name="plus" size={16}/> ثبت تعامل جدید</button>
            </section>
            <section className="panel opportunity">
              <div className="panel-head"><div><h2>فرصت فروش فعال</h2><p>پیش‌فاکتور باتری لیفتراک سری L</p></div><span className="status warning">در حال مذاکره</span></div>
              <div className="opportunity-info"><div><span>ارزش فرصت</span><strong>۴۲۰ میلیون تومان</strong></div><div><span>احتمال موفقیت</span><strong>٪۷۵</strong></div><div><span>تاریخ پیش‌بینی فروش</span><strong>۱۰ آبان ۱۴۰۳</strong></div></div>
              <div className="progress-label"><span>پیشرفت مسیر فروش</span><b>مرحله ۳ از ۵</b></div>
              <div className="sales-progress"><i className="done"/><i className="done"/><i className="current"/><i/><i/></div>
              <div className="progress-steps"><span>تماس اولیه</span><span>نیازسنجی</span><span>مذاکره</span><span>پیش‌فاکتور</span><span>فروش</span></div>
            </section>
          </div>
          <aside className="profile-side">
            <section className="panel contact-card">
              <div className="panel-head"><h2>اطلاعات تماس</h2><button className="more-button"><Icon name="edit" size={17}/></button></div>
              <div className="contact-person"><div className="person-avatar">{customer.contactName.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><div><strong>{customer.contactName}</strong><span>رابط اصلی مشتری</span></div><span className="status success">تصمیم‌گیرنده</span></div>
              <div className="contact-list"><div><Icon name="phone" size={18}/><span><small>شماره همراه</small><b>{customer.phone}</b></span></div><div><Icon name="mail" size={18}/><span><small>ایمیل</small><b dir="ltr">{customer.email}</b></span></div><div><Icon name="location" size={18}/><span><small>نشانی</small><b>{customer.location}</b></span></div></div>
            </section>
            <section className="panel next-action">
              <div className="panel-head"><h2>اقدام بعدی</h2><span className="tag orange">اولویت بالا</span></div>
              <strong>تماس برای نهایی‌سازی پیش‌فاکتور</strong><p>هماهنگی زمان تحویل و شرایط پرداخت با آقای محمودی</p>
              <div className="action-date"><Icon name="calendar" size={18}/><div><span>زمان پیگیری</span><b>فردا، ۲۵ مهر · ساعت ۱۰:۰۰</b></div></div>
              <div className="action-buttons"><button className="outline-button"><Icon name="check" size={17}/> انجام شد</button><button className="primary-button"><Icon name="phone" size={17}/> شروع تماس</button></div>
            </section>
            <section className="panel interests">
              <div className="panel-head"><h2>علاقه‌مندی محصولات</h2><button className="more-button"><Icon name="plus" size={17}/></button></div>
              <div><span>باتری لیفتراک سری L</span><b>علاقه زیاد</b></div><div><span>باتری یوپی‌اس صنعتی</span><b>علاقه متوسط</b></div><div><span>خدمات نگهداری دوره‌ای</span><b>در حال بررسی</b></div>
            </section>
          </aside>
        </div>}
      </main>
    </>
  );
}

function EmptyTab({ tab }: { tab: string }) {
  return <section className="panel empty-tab"><div className="empty-icon"><Icon name="file" size={26}/></div><h2>{tab}</h2><p>اطلاعات این بخش در نسخه نمایشی به‌صورت خلاصه نمایش داده می‌شود.</p><button className="primary-button"><Icon name="plus" size={17}/> افزودن مورد جدید</button></section>;
}

function Modal({ title, description, onClose, children }: { title: string; description: string; onClose: () => void; children: ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal-card" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-head"><div><h2>{title}</h2><p>{description}</p></div><button className="modal-close" onClick={onClose} aria-label="بستن">×</button></div>
      {children}
    </section>
  </div>;
}

function CustomerForm({ customer, onSave, onClose }: { customer?: Customer; onSave: (customer: Customer) => void; onClose: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: customer?.id ?? `cus-${Date.now()}`,
      name: String(form.get("name")),
      contactName: String(form.get("contactName")),
      phone: String(form.get("phone")),
      email: String(form.get("email")),
      type: String(form.get("type")) as CustomerType,
      industry: String(form.get("industry")),
      location: String(form.get("location")),
      owner: String(form.get("owner")),
      status: customer?.status ?? "فعال",
      lastInteraction: customer?.lastInteraction ?? "هنوز ثبت نشده",
    });
  }
  return <Modal title={customer ? "ویرایش مشتری" : "ثبت مشتری جدید"} description="اطلاعات این فرم کاملاً ساختگی و مخصوص نسخه نمایشی است." onClose={onClose}>
    <form className="crm-form" onSubmit={submit}>
      <label><span>نام مشتری یا شرکت</span><input name="name" required defaultValue={customer?.name} placeholder="مثلاً شرکت نمونه ایرانیان"/></label>
      <label><span>نام رابط اصلی</span><input name="contactName" required defaultValue={customer?.contactName} placeholder="نام و نام خانوادگی"/></label>
      <label><span>نوع مشتری</span><select name="type" defaultValue={customer?.type ?? "حقوقی"}><option>حقوقی</option><option>حقیقی</option><option>نماینده</option></select></label>
      <label><span>حوزه فعالیت</span><input name="industry" required defaultValue={customer?.industry} placeholder="تجهیزات صنعتی"/></label>
      <label><span>شماره تماس</span><input name="phone" required defaultValue={customer?.phone} placeholder="۰۹۱۲ ۰۰۰ ۰۰۰۰"/></label>
      <label><span>ایمیل نمایشی</span><input name="email" type="email" required defaultValue={customer?.email} placeholder="name@example.ir" dir="ltr"/></label>
      <label className="form-wide"><span>نشانی</span><input name="location" required defaultValue={customer?.location} placeholder="استان، شهر، نشانی کوتاه"/></label>
      <label className="form-wide"><span>مسئول پیگیری</span><select name="owner" defaultValue={customer?.owner ?? "احسان باقری"}><option>احسان باقری</option><option>سارا احمدی</option><option>علی رضایی</option></select></label>
      <div className="form-actions"><button type="button" className="outline-button" onClick={onClose}>انصراف</button><button className="primary-button" type="submit"><Icon name="check" size={17}/>{customer ? "ذخیره تغییرات" : "ثبت مشتری"}</button></div>
    </form>
  </Modal>;
}

function CustomersPage({ customers, onOpen, onCreate }: { customers: Customer[]; onOpen: (customer: Customer) => void; onCreate: () => void }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"همه" | CustomerType>("همه");
  const filtered = useMemo(() => customers.filter((customer) => {
    const matchesQuery = `${customer.name} ${customer.contactName} ${customer.phone}`.includes(query);
    return matchesQuery && (type === "همه" || customer.type === type);
  }), [customers, query, type]);

  return <>
    <Header page="مشتریان" onQuickAdd={onCreate}/>
    <main className="content">
      <section className="page-toolbar">
        <div className="toolbar-search"><Icon name="search" size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجو در نام، رابط یا شماره تماس..."/></div>
        <label className="toolbar-filter"><Icon name="filter" size={17}/><select value={type} onChange={(event) => setType(event.target.value as "همه" | CustomerType)}><option>همه</option><option>حقوقی</option><option>حقیقی</option><option>نماینده</option></select></label>
        <button className="primary-button" onClick={onCreate}><Icon name="plus" size={17}/> ثبت مشتری جدید</button>
      </section>
      <section className="summary-strip">
        <div><span>همه مشتریان</span><strong>{customers.length}</strong></div><div><span>مشتریان حقوقی</span><strong>{customers.filter((item) => item.type === "حقوقی").length}</strong></div><div><span>نیازمند پیگیری</span><strong className="danger-text">{customers.filter((item) => item.status === "نیازمند پیگیری").length}</strong></div>
      </section>
      <section className="panel data-panel">
        <div className="data-panel-head"><div><h2>فهرست مشتریان</h2><p>{filtered.length} مشتری مطابق فیلتر فعلی</p></div><span className="demo-label">داده نمایشی</span></div>
        <div className="crm-table customer-list-table">
          <div className="crm-table-head"><span>مشتری</span><span>نوع</span><span>آخرین تعامل</span><span>مسئول پیگیری</span><span>وضعیت</span><span/></div>
          {filtered.map((customer) => <button className="crm-table-row" key={customer.id} onClick={() => onOpen(customer)}>
            <span className="customer-name"><b className="mini-avatar">{customer.name.slice(0, 1)}</b><span><strong>{customer.name}</strong><small>{customer.contactName} · {customer.phone}</small></span></span>
            <span><i className="neutral-badge">{customer.type}</i></span><span>{customer.lastInteraction}</span><span>{customer.owner}</span><span><i className={`status ${customer.status === "فعال" ? "success" : "danger"}`}>{customer.status}</i></span><Icon name="chevron" size={17}/>
          </button>)}
          {!filtered.length && <div className="no-results"><Icon name="search" size={24}/><strong>مشتری‌ای پیدا نشد</strong><span>عبارت جست‌وجو یا فیلتر را تغییر دهید.</span></div>}
        </div>
      </section>
    </main>
  </>;
}

const orderTone: Record<OrderStatus, string> = {
  "ثبت سفارش": "info", "تأیید قیمت": "warning", "مونتاژ": "purple", "کنترل کیفیت": "info", "آماده تحویل": "success", "تحویل‌شده": "success", "انتظار قطعه": "danger", "تحویل جزئی": "warning", "لغوشده": "danger",
};

function OrderForm({ customers, onSave, onClose }: { customers: Customer[]; onSave: (order: BatteryOrder) => void; onClose: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: `سفارش ${String(Date.now()).slice(-4)}`,
      customerId: String(form.get("customerId")),
      batteryModel: String(form.get("batteryModel")),
      quantity: Number(form.get("quantity")),
      amount: String(form.get("amount")),
      deliveryDate: String(form.get("deliveryDate")),
      status: "ثبت سفارش",
    });
  }
  return <Modal title="ثبت سفارش باتری" description="سفارش جدید با وضعیت «ثبت سفارش» وارد جریان کار می‌شود." onClose={onClose}>
    <form className="crm-form" onSubmit={submit}>
      <label className="form-wide"><span>مشتری</span><select name="customerId" required>{customers.map((customer) => <option value={customer.id} key={customer.id}>{customer.name}</option>)}</select></label>
      <label><span>مدل باتری</span><input name="batteryModel" required placeholder="مثلاً لیفتراک L-24"/></label>
      <label><span>تعداد</span><input name="quantity" type="number" min="1" required defaultValue="1"/></label>
      <label><span>مبلغ</span><input name="amount" required placeholder="مثلاً ۱۲۰ میلیون"/></label>
      <label><span>تاریخ تحویل شمسی</span><input name="deliveryDate" required placeholder="۱۰ آبان ۱۴۰۳"/></label>
      <div className="form-actions"><button type="button" className="outline-button" onClick={onClose}>انصراف</button><button className="primary-button" type="submit"><Icon name="box" size={17}/> ثبت سفارش</button></div>
    </form>
  </Modal>;
}

function OrdersPage({ orders, customers, onCreate, onStatusChange }: { orders: BatteryOrder[]; customers: Customer[]; onCreate: () => void; onStatusChange: (id: string, status: OrderStatus) => void }) {
  const [statusFilter, setStatusFilter] = useState("همه");
  const filtered = statusFilter === "همه" ? orders : orders.filter((order) => order.status === statusFilter);
  const customerName = (id: string) => customers.find((customer) => customer.id === id)?.name ?? "مشتری نامشخص";
  return <>
    <Header page="سفارش‌ها" onQuickAdd={onCreate}/>
    <main className="content">
      <section className="page-toolbar">
        <div className="toolbar-title"><strong>جریان سفارش‌ها</strong><span>وضعیت هر سفارش را مستقیماً به‌روزرسانی کنید.</span></div>
        <label className="toolbar-filter"><Icon name="filter" size={17}/><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>همه</option>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <button className="primary-button" onClick={onCreate}><Icon name="plus" size={17}/> ثبت سفارش</button>
      </section>
      <section className="order-stats">
        <div><span>کل سفارش‌ها</span><strong>{orders.length}</strong></div><div><span>در حال تولید</span><strong>{orders.filter((order) => ["مونتاژ", "کنترل کیفیت"].includes(order.status)).length}</strong></div><div><span>آماده تحویل</span><strong>{orders.filter((order) => order.status === "آماده تحویل").length}</strong></div><div><span>متوقف</span><strong className="danger-text">{orders.filter((order) => order.status === "انتظار قطعه").length}</strong></div>
      </section>
      <section className="panel data-panel">
        <div className="data-panel-head"><div><h2>فهرست سفارش‌های باتری</h2><p>تمام مبالغ و مشتریان این صفحه ساختگی هستند.</p></div><span className="demo-label">نسخه نمایشی</span></div>
        <div className="crm-table order-table">
          <div className="crm-table-head"><span>شماره و مشتری</span><span>مدل باتری</span><span>تعداد</span><span>مبلغ</span><span>تاریخ تحویل</span><span>وضعیت سفارش</span></div>
          {filtered.map((order) => <div className="crm-table-row" key={order.id}>
            <span className="order-identity"><strong>{order.id}</strong><small>{customerName(order.customerId)}</small></span><span>{order.batteryModel}</span><span>{order.quantity} عدد</span><span>{order.amount} تومان</span><span>{order.deliveryDate}</span>
            <span><select className={`status-select ${orderTone[order.status]}`} value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></span>
          </div>)}
        </div>
      </section>
    </main>
  </>;
}

function TaskForm({ customers, onSave, onClose }: { customers: Customer[]; onSave: (task: CrmTask) => void; onClose: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: `task-${Date.now()}`,
      title: String(form.get("title")),
      customer: String(form.get("customer")),
      date: String(form.get("date")),
      time: String(form.get("time")),
      group: String(form.get("group")) as CrmTask["group"],
      type: String(form.get("type")) as CrmTask["type"],
      completed: false,
    });
  }
  return <Modal title="ثبت فعالیت جدید" description="پیگیری جدید را به برنامه کاری اضافه کنید." onClose={onClose}>
    <form className="crm-form" onSubmit={submit}>
      <label className="form-wide"><span>عنوان فعالیت</span><input name="title" required placeholder="مثلاً تماس برای تأیید پیش‌فاکتور"/></label>
      <label><span>مشتری</span><select name="customer">{customers.map((customer) => <option key={customer.id}>{customer.name}</option>)}</select></label>
      <label><span>نوع فعالیت</span><select name="type"><option>تماس</option><option>جلسه</option><option>وظیفه</option><option>سفارش</option></select></label>
      <label><span>بازه زمانی</span><select name="group"><option>امروز</option><option>آینده</option><option>عقب‌افتاده</option></select></label>
      <label><span>تاریخ شمسی</span><input name="date" required placeholder="۲۶ مهر ۱۴۰۳"/></label>
      <label><span>ساعت</span><input name="time" required placeholder="۱۰:۳۰"/></label>
      <div className="form-actions"><button type="button" className="outline-button" onClick={onClose}>انصراف</button><button className="primary-button" type="submit"><Icon name="plus" size={17}/> افزودن فعالیت</button></div>
    </form>
  </Modal>;
}

function TasksPage({ tasks, onCreate, onToggle }: { tasks: CrmTask[]; onCreate: () => void; onToggle: (id: string) => void }) {
  const [group, setGroup] = useState<CrmTask["group"]>("امروز");
  const visible = tasks.filter((task) => task.group === group);
  return <>
    <Header page="وظایف و تقویم" onQuickAdd={onCreate}/>
    <main className="content">
      <section className="task-summary">
        {(["امروز", "آینده", "عقب‌افتاده"] as const).map((item) => <button key={item} className={group === item ? "active" : ""} onClick={() => setGroup(item)}><span>{item}</span><strong>{tasks.filter((task) => task.group === item && !task.completed).length}</strong><small>{item === "امروز" ? "فعالیت در برنامه" : item === "آینده" ? "پیگیری برنامه‌ریزی‌شده" : "نیازمند رسیدگی"}</small></button>)}
      </section>
      <section className="panel task-board">
        <div className="data-panel-head"><div><h2>فعالیت‌های {group}</h2><p>با انتخاب دایره، فعالیت به‌عنوان انجام‌شده ثبت می‌شود.</p></div><button className="primary-button" onClick={onCreate}><Icon name="plus" size={17}/> فعالیت جدید</button></div>
        <div className="full-task-list">
          {visible.map((task) => <div className={`full-task-row ${task.completed ? "completed" : ""} ${task.group === "عقب‌افتاده" ? "overdue" : ""}`} key={task.id}>
            <button className="task-check" onClick={() => onToggle(task.id)} aria-label={task.completed ? "بازگرداندن فعالیت" : "علامت‌گذاری به‌عنوان انجام‌شده"}>{task.completed && <Icon name="check" size={15}/>}</button>
            <div className={`task-marker ${task.type === "تماس" ? "teal" : task.type === "جلسه" ? "blue" : task.type === "سفارش" ? "purple" : "orange"}`}><Icon name={task.type === "تماس" ? "phone" : task.type === "جلسه" ? "users" : task.type === "سفارش" ? "box" : "check"} size={17}/></div>
            <div className="full-task-copy"><strong>{task.title}</strong><span>{task.customer}</span></div>
            <div className="task-date"><Icon name="calendar" size={15}/><span>{task.date}</span><b>{task.time}</b></div>
            <span className={`tag ${task.group === "عقب‌افتاده" ? "orange" : "teal"}`}>{task.completed ? "انجام‌شده" : task.group}</span>
          </div>)}
        </div>
      </section>
    </main>
  </>;
}

type ChatMessage = { id: number; role: "assistant" | "user"; text: string };
const assistantSuggestions = ["مشتریان نیازمند پیگیری را نشان بده", "سفارش‌های معوق کدام‌اند؟", "برنامه امروز من چیست؟"];

function AssistantPage({ tasks, orders }: { tasks: CrmTask[]; orders: BatteryOrder[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 1, role: "assistant", text: "سلام احسان. من نسخه نمایشی دستیار آتا هستم. می‌توانم بر اساس داده‌های ساختگی این نمونه، پیگیری‌ها و سفارش‌های نیازمند توجه را خلاصه کنم." }]);
  const [input, setInput] = useState("");
  function send(text: string) {
    if (!text.trim()) return;
    const delayedOrders = orders.filter((order) => ["انتظار قطعه", "لغوشده", "تحویل جزئی"].includes(order.status)).length;
    const overdue = tasks.filter((task) => task.group === "عقب‌افتاده" && !task.completed).length;
    const response = text.includes("سفارش") ? `${delayedOrders} سفارش نیازمند بررسی است. پیشنهاد می‌کنم ابتدا سفارش‌های در انتظار قطعه را با واحد تأمین هماهنگ کنید. این پاسخ نمایشی است.` : text.includes("امروز") ? `برای امروز ${tasks.filter((task) => task.group === "امروز" && !task.completed).length} فعالیت باز دارید. این پاسخ نمایشی است و به تقویم واقعی متصل نیست.` : `${overdue} پیگیری عقب‌افتاده و یک مشتری با اولویت بالا شناسایی شد. پیشنهاد می‌کنم تماس با صنایع آریا شرق در اولویت باشد. این پاسخ نمایشی است.`;
    setMessages((current) => [...current, { id: Date.now(), role: "user", text }, { id: Date.now() + 1, role: "assistant", text: response }]);
    setInput("");
  }
  return <>
    <Header page="دستیار هوشمند" onQuickAdd={() => send("برنامه امروز من چیست؟")}/>
    <main className="content assistant-page">
      <div className="assistant-layout">
        <section className="panel chat-panel">
          <div className="chat-head"><div className="assistant-icon-large"><Icon name="spark" size={24}/></div><div><strong>دستیار آتا</strong><span>حالت نمایشی · بدون اتصال به مدل هوش مصنوعی</span></div><i>آنلاین نمایشی</i></div>
          <div className="messages">
            {messages.map((message) => <div className={`message ${message.role}`} key={message.id}>{message.role === "assistant" && <div className="chat-avatar"><Icon name="spark" size={16}/></div>}<p>{message.text}</p></div>)}
          </div>
          <div className="suggestion-chips">{assistantSuggestions.map((suggestion) => <button key={suggestion} onClick={() => send(suggestion)}>{suggestion}</button>)}</div>
          <form className="chat-input" onSubmit={(event) => { event.preventDefault(); send(input); }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="پیام خود را بنویسید..."/><button aria-label="ارسال پیام"><Icon name="arrow" size={19}/></button></form>
          <p className="ai-disclaimer">پاسخ‌ها صرفاً نمایشی هستند و نباید مبنای تصمیم مالی یا عملیاتی قرار گیرند.</p>
        </section>
        <aside className="assistant-side">
          <section className="panel smart-card"><div className="smart-card-icon warning"><Icon name="clock" size={20}/></div><div><span>پیگیری‌های عقب‌افتاده</span><strong>{tasks.filter((task) => task.group === "عقب‌افتاده" && !task.completed).length} مورد</strong></div><button onClick={() => send("مشتریان نیازمند پیگیری را نشان بده")}><Icon name="chevron" size={17}/></button></section>
          <section className="panel smart-card"><div className="smart-card-icon danger"><Icon name="box" size={20}/></div><div><span>سفارش‌های نیازمند توجه</span><strong>{orders.filter((order) => ["انتظار قطعه", "تحویل جزئی"].includes(order.status)).length} مورد</strong></div><button onClick={() => send("سفارش‌های معوق کدام‌اند؟")}><Icon name="chevron" size={17}/></button></section>
          <section className="panel assistant-note"><Icon name="spark" size={22}/><strong>درباره این نسخه</strong><p>هیچ مدل هوش مصنوعی یا سرویس خارجی فعال نیست. پاسخ‌ها از چند الگوی ثابت و داده‌های ساختگی همین مرورگر تولید می‌شوند.</p></section>
        </aside>
      </div>
    </main>
  </>;
}

function MobileNav({ page, setPage, onQuickAdd }: { page: Page; setPage: (page: Page) => void; onQuickAdd: () => void }) {
  return <nav className="mobile-nav">
    <button className={page === "داشبورد" ? "active" : ""} onClick={() => setPage("داشبورد")}><Icon name="grid" size={21}/><span>خانه</span></button>
    <button className={page === "مشتریان" || page === "پرونده مشتری" ? "active" : ""} onClick={() => setPage("مشتریان")}><Icon name="users" size={21}/><span>مشتریان</span></button>
    <button className={page === "سفارش‌ها" ? "active" : ""} onClick={() => setPage("سفارش‌ها")}><Icon name="box" size={21}/><span>سفارش‌ها</span></button>
    <button className="mobile-add" aria-label="ثبت سریع" onClick={onQuickAdd}><Icon name="plus" size={25}/></button>
    <button className={page === "وظایف و تقویم" ? "active" : ""} onClick={() => setPage("وظایف و تقویم")}><Icon name="check" size={21}/><span>وظایف</span></button>
    <button className={page === "دستیار هوشمند" ? "active" : ""} onClick={() => setPage("دستیار هوشمند")}><Icon name="spark" size={21}/><span>دستیار</span></button>
  </nav>;
}

export default function App() {
  const [page, setPage] = useState<Page>("داشبورد");
  const [customers, setCustomers] = usePersistentState("ata-demo-customers", demoCustomers);
  const [orders, setOrders] = usePersistentState("ata-demo-orders", demoOrders);
  const [tasks, setTasks] = usePersistentState("ata-demo-tasks", demoTasks);
  const [selectedCustomerId, setSelectedCustomerId] = useState(demoCustomers[0].id);
  const [modal, setModal] = useState<"customer" | "edit-customer" | "order" | "task" | null>(null);
  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? customers[0];

  function quickAdd() {
    if (page === "سفارش‌ها") setModal("order");
    else if (page === "وظایف و تقویم") setModal("task");
    else setModal("customer");
  }

  function renderPage() {
    if (page === "مشتریان") return <CustomersPage customers={customers} onCreate={() => setModal("customer")} onOpen={(customer) => { setSelectedCustomerId(customer.id); setPage("پرونده مشتری"); }}/>;
    if (page === "پرونده مشتری" && selectedCustomer) return <CustomerProfile customer={selectedCustomer} orders={orders.filter((order) => order.customerId === selectedCustomer.id)} onBack={() => setPage("مشتریان")} onEdit={() => setModal("edit-customer")}/>;
    if (page === "سفارش‌ها") return <OrdersPage orders={orders} customers={customers} onCreate={() => setModal("order")} onStatusChange={(id, status) => setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order))}/>;
    if (page === "وظایف و تقویم") return <TasksPage tasks={tasks} onCreate={() => setModal("task")} onToggle={(id) => setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))}/>;
    if (page === "دستیار هوشمند") return <AssistantPage tasks={tasks} orders={orders}/>;
    return <Dashboard setPage={setPage} openQuickAdd={quickAdd}/>;
  }

  return (
    <div className="app" dir="rtl">
      <Sidebar page={page} setPage={setPage} openTasks={tasks.filter((task) => !task.completed).length}/>
      <div className="workspace">{renderPage()}</div>
      <MobileNav page={page} setPage={setPage} onQuickAdd={quickAdd}/>
      {modal === "customer" && <CustomerForm onClose={() => setModal(null)} onSave={(customer) => { setCustomers((current) => [customer, ...current]); setModal(null); setSelectedCustomerId(customer.id); setPage("پرونده مشتری"); }}/>}
      {modal === "edit-customer" && selectedCustomer && <CustomerForm customer={selectedCustomer} onClose={() => setModal(null)} onSave={(customer) => { setCustomers((current) => current.map((item) => item.id === customer.id ? customer : item)); setModal(null); }}/>}
      {modal === "order" && <OrderForm customers={customers} onClose={() => setModal(null)} onSave={(order) => { setOrders((current) => [order, ...current]); setModal(null); setPage("سفارش‌ها"); }}/>}
      {modal === "task" && <TaskForm customers={customers} onClose={() => setModal(null)} onSave={(task) => { setTasks((current) => [task, ...current]); setModal(null); setPage("وظایف و تقویم"); }}/>}
    </div>
  );
}

function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) as T : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}
