import type { Language } from "./config";

/** Palavra usada para o comando de ajuda do bot, por idioma (exibida na UI e reconhecida pelo parser). */
export const HELP_COMMAND_WORD: Record<Language, string> = {
  pt: "ajuda",
  en: "help",
  fr: "aide",
  ar: "مساعدة",
  zh: "帮助",
};

type BotStrings = {
  help: string;
  greeting: (firstName: string) => string;
  expenseLabel: string;
  incomeLabel: string;
  recorded: string;
  inWord: string;
  categoryLabel: string;
  summaryTitle: (month: string) => string;
  income: string;
  expense: string;
  balance: string;
  budgetLabel: string;
  reportTitle: (period: string) => string;
  reportEmpty: (period: string) => string;
  reportTotal: string;
  periodDay: string;
  periodWeek: string;
  periodMonth: string;
  contactAdded: string;
  stageLabel: string;
  contactsTitle: (count: number) => string;
  noContacts: string;
  unlinkedNumber: (appUrl: string) => string;
  onlyText: string;
  unknown: string;
  languageChanged: string;
};

const help: Record<Language, string> = {
  pt: `🤖 *HSantos — Gastos & CRM*

Eu te ajudo a controlar suas finanças e seus contatos pelo WhatsApp.

💸 *Registrar gasto*
• "gastei 50 no mercado"
• "30 uber"
• "-120 farmácia"

💰 *Registrar receita*
• "recebi 2000 salário"
• "+500 venda cliente"

📊 *Consultar*
• "saldo" — saldo do mês
• "relatório" — resumo do mês
• "relatório semana" / "relatório hoje"

🤝 *CRM*
• "contato Maria 11999998888 empresa Acme"
• "leads" — listar contatos

Digite *ajuda* a qualquer momento para ver este menu.`,
  en: `🤖 *HSantos — Expenses & CRM*

I help you manage your finances and contacts via WhatsApp.

💸 *Record an expense*
• "spent 50 on groceries"
• "30 uber"
• "-120 pharmacy"

💰 *Record income*
• "received 2000 salary"
• "+500 sale client"

📊 *Check*
• "balance" — this month's balance
• "report" — monthly summary
• "report week" / "report today"

🤝 *CRM*
• "contact Maria 11999998888 company Acme"
• "leads" — list contacts

Type *help* anytime to see this menu.`,
  fr: `🤖 *HSantos — Dépenses & CRM*

Je vous aide à gérer vos finances et vos contacts via WhatsApp.

💸 *Enregistrer une dépense*
• "dépensé 50 en courses"
• "30 uber"
• "-120 pharmacie"

💰 *Enregistrer un revenu*
• "reçu 2000 salaire"
• "+500 vente client"

📊 *Consulter*
• "solde" — solde du mois
• "rapport" — résumé du mois
• "rapport semaine" / "rapport aujourd'hui"

🤝 *CRM*
• "contact Maria 11999998888 entreprise Acme"
• "leads" — liste des contacts

Tapez *aide* à tout moment pour revoir ce menu.`,
  ar: `🤖 *HSantos — المصاريف وإدارة العملاء*

أساعدك في إدارة أموالك وجهات اتصالك عبر واتساب.

💸 *تسجيل مصروف*
• "صرفت 50 على البقالة"
• "30 أوبر"
• "-120 صيدلية"

💰 *تسجيل إيراد*
• "استلمت 2000 راتب"
• "+500 بيع عميل"

📊 *الاستعلام*
• "رصيد" — رصيد الشهر
• "تقرير" — ملخص الشهر
• "تقرير الأسبوع" / "تقرير اليوم"

🤝 *إدارة العملاء*
• "جهة اتصال ماريا 11999998888 شركة Acme"
• "leads" — عرض جهات الاتصال

اكتب *مساعدة* في أي وقت لعرض هذه القائمة.`,
  zh: `🤖 *HSantos — 支出与客户管理*

我可以帮您通过WhatsApp管理财务和联系人。

💸 *记录支出*
• "杂货花了50"
• "打车30"
• "-120药店"

💰 *记录收入*
• "收到2000工资"
• "+500销售客户"

📊 *查询*
• "余额" — 本月余额
• "报表" — 本月摘要
• "报表 本周" / "报表 今天"

🤝 *客户管理*
• "联系人 Maria 11999998888 公司 Acme"
• "leads" — 列出联系人

随时输入 *帮助* 查看此菜单。`,
};

export const botStrings: Record<Language, BotStrings> = {
  pt: {
    help: help.pt,
    greeting: (name) => `Olá, ${name}! 👋\n\n${help.pt}`,
    expenseLabel: "Gasto",
    incomeLabel: "Receita",
    recorded: "registrado!",
    inWord: "em",
    categoryLabel: "Categoria:",
    summaryTitle: (month) => `📊 *Resumo de ${month}*`,
    income: "Receitas:",
    expense: "Gastos:",
    balance: "Saldo:",
    budgetLabel: "Orçamento:",
    reportTitle: (period) => `📊 *Gastos ${period}*`,
    reportEmpty: (period) => `📊 Nenhum gasto registrado ${period}.`,
    reportTotal: "Total:",
    periodDay: "hoje",
    periodWeek: "esta semana",
    periodMonth: "este mês",
    contactAdded: "🤝 *Contato adicionado ao CRM!*",
    stageLabel: "Estágio:",
    contactsTitle: (count) => `📇 *Seus contatos* (${count})`,
    noContacts: "📇 Você ainda não tem contatos.\nAdicione com: *contato Nome 11999998888*",
    unlinkedNumber: (appUrl) =>
      `Olá! 👋 Este número ainda não está vinculado a uma conta HSantos.\n\nCrie sua conta em ${appUrl} e cadastre este número de WhatsApp nas configurações para começar a registrar seus gastos.`,
    onlyText: "Por enquanto só consigo entender mensagens de texto 🙂\nDigite *ajuda* para ver os comandos.",
    unknown: `Não entendi 🤔\nTente algo como "gastei 50 no mercado" ou digite *ajuda* para ver os comandos.`,
    languageChanged: "✅ Idioma alterado para Português.",
  },
  en: {
    help: help.en,
    greeting: (name) => `Hi, ${name}! 👋\n\n${help.en}`,
    expenseLabel: "Expense",
    incomeLabel: "Income",
    recorded: "recorded!",
    inWord: "on",
    categoryLabel: "Category:",
    summaryTitle: (month) => `📊 *${month} summary*`,
    income: "Income:",
    expense: "Expenses:",
    balance: "Balance:",
    budgetLabel: "Budget:",
    reportTitle: (period) => `📊 *Expenses ${period}*`,
    reportEmpty: (period) => `📊 No expenses recorded ${period}.`,
    reportTotal: "Total:",
    periodDay: "today",
    periodWeek: "this week",
    periodMonth: "this month",
    contactAdded: "🤝 *Contact added to CRM!*",
    stageLabel: "Stage:",
    contactsTitle: (count) => `📇 *Your contacts* (${count})`,
    noContacts: "📇 You don't have any contacts yet.\nAdd one with: *contact Name 11999998888*",
    unlinkedNumber: (appUrl) =>
      `Hi! 👋 This number isn't linked to an HSantos account yet.\n\nCreate your account at ${appUrl} and register this WhatsApp number in settings to start tracking your expenses.`,
    onlyText: "For now I can only understand text messages 🙂\nType *help* to see the commands.",
    unknown: `I didn't understand that 🤔\nTry something like "spent 50 on groceries" or type *help* to see the commands.`,
    languageChanged: "✅ Language changed to English.",
  },
  fr: {
    help: help.fr,
    greeting: (name) => `Bonjour, ${name} ! 👋\n\n${help.fr}`,
    expenseLabel: "Dépense",
    incomeLabel: "Revenu",
    recorded: "enregistré(e) !",
    inWord: "pour",
    categoryLabel: "Catégorie :",
    summaryTitle: (month) => `📊 *Résumé de ${month}*`,
    income: "Revenus :",
    expense: "Dépenses :",
    balance: "Solde :",
    budgetLabel: "Budget :",
    reportTitle: (period) => `📊 *Dépenses ${period}*`,
    reportEmpty: (period) => `📊 Aucune dépense enregistrée ${period}.`,
    reportTotal: "Total :",
    periodDay: "aujourd'hui",
    periodWeek: "cette semaine",
    periodMonth: "ce mois-ci",
    contactAdded: "🤝 *Contact ajouté au CRM !*",
    stageLabel: "Étape :",
    contactsTitle: (count) => `📇 *Vos contacts* (${count})`,
    noContacts: "📇 Vous n'avez pas encore de contacts.\nAjoutez-en un avec : *contact Nom 11999998888*",
    unlinkedNumber: (appUrl) =>
      `Bonjour ! 👋 Ce numéro n'est pas encore lié à un compte HSantos.\n\nCréez votre compte sur ${appUrl} et enregistrez ce numéro WhatsApp dans les paramètres pour commencer à suivre vos dépenses.`,
    onlyText: "Pour l'instant, je ne comprends que les messages texte 🙂\nTapez *aide* pour voir les commandes.",
    unknown: `Je n'ai pas compris 🤔\nEssayez quelque chose comme "dépensé 50 en courses" ou tapez *aide* pour voir les commandes.`,
    languageChanged: "✅ Langue changée en Français.",
  },
  ar: {
    help: help.ar,
    greeting: (name) => `مرحبًا، ${name}! 👋\n\n${help.ar}`,
    expenseLabel: "مصروف",
    incomeLabel: "إيراد",
    recorded: "تم التسجيل!",
    inWord: "على",
    categoryLabel: "الفئة:",
    summaryTitle: (month) => `📊 *ملخص ${month}*`,
    income: "الإيرادات:",
    expense: "المصاريف:",
    balance: "الرصيد:",
    budgetLabel: "الميزانية:",
    reportTitle: (period) => `📊 *المصاريف ${period}*`,
    reportEmpty: (period) => `📊 لا توجد مصاريف مسجلة ${period}.`,
    reportTotal: "الإجمالي:",
    periodDay: "اليوم",
    periodWeek: "هذا الأسبوع",
    periodMonth: "هذا الشهر",
    contactAdded: "🤝 *تمت إضافة جهة الاتصال إلى إدارة العملاء!*",
    stageLabel: "المرحلة:",
    contactsTitle: (count) => `📇 *جهات اتصالك* (${count})`,
    noContacts: "📇 ليس لديك جهات اتصال بعد.\nأضف واحدة عبر: *جهة اتصال الاسم 11999998888*",
    unlinkedNumber: (appUrl) =>
      `مرحبًا! 👋 هذا الرقم غير مرتبط بحساب HSantos بعد.\n\nأنشئ حسابك على ${appUrl} وسجّل رقم الواتساب هذا في الإعدادات لبدء تسجيل مصاريفك.`,
    onlyText: "حاليًا يمكنني فهم الرسائل النصية فقط 🙂\nاكتب *مساعدة* لرؤية الأوامر.",
    unknown: `لم أفهم ذلك 🤔\nجرّب شيئًا مثل "صرفت 50 على البقالة" أو اكتب *مساعدة* لرؤية الأوامر.`,
    languageChanged: "✅ تم تغيير اللغة إلى العربية.",
  },
  zh: {
    help: help.zh,
    greeting: (name) => `你好，${name}！👋\n\n${help.zh}`,
    expenseLabel: "支出",
    incomeLabel: "收入",
    recorded: "已记录！",
    inWord: "于",
    categoryLabel: "分类：",
    summaryTitle: (month) => `📊 *${month}摘要*`,
    income: "收入：",
    expense: "支出：",
    balance: "余额：",
    budgetLabel: "预算：",
    reportTitle: (period) => `📊 *支出（${period}）*`,
    reportEmpty: (period) => `📊 ${period}没有支出记录。`,
    reportTotal: "总计：",
    periodDay: "今天",
    periodWeek: "本周",
    periodMonth: "本月",
    contactAdded: "🤝 *联系人已添加到客户管理！*",
    stageLabel: "阶段：",
    contactsTitle: (count) => `📇 *您的联系人*（${count}）`,
    noContacts: "📇 您还没有联系人。\n添加方式：*联系人 姓名 11999998888*",
    unlinkedNumber: (appUrl) =>
      `你好！👋 此号码尚未关联HSantos账户。\n\n请在 ${appUrl} 创建账户，并在设置中注册此WhatsApp号码以开始记录支出。`,
    onlyText: "目前我只能理解文本消息 🙂\n输入 *帮助* 查看指令。",
    unknown: `我没听懂 🤔\n试试类似"杂货花了50"这样的内容，或输入 *帮助* 查看指令。`,
    languageChanged: "✅ 语言已切换为中文。",
  },
};

/** Palavras usadas para trocar o idioma do bot via WhatsApp (ex.: "idioma english"). */
export const LANGUAGE_COMMAND_WORDS = ["idioma", "language", "langue", "لغة", "语言"];

export const LANGUAGE_NAME_MAP: Record<string, Language> = {
  pt: "pt",
  portugues: "pt",
  português: "pt",
  portuguese: "pt",
  en: "en",
  ingles: "en",
  inglês: "en",
  english: "en",
  fr: "fr",
  frances: "fr",
  francês: "fr",
  french: "fr",
  français: "fr",
  ar: "ar",
  arabe: "ar",
  árabe: "ar",
  arabic: "ar",
  العربية: "ar",
  عربي: "ar",
  zh: "zh",
  mandarim: "zh",
  mandarin: "zh",
  chinese: "zh",
  chines: "zh",
  chinês: "zh",
  中文: "zh",
};
