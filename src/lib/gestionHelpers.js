export const ROLE_LABELS = {
  super_admin: "Super admin",
  admin: "Administrador",
  entrenador: "Entrenador",
  lectura: "Solo lectura",
  jugador: "Jugador/a",
};

export const PAYMENT_STATUS_LABELS = {
  pagado: "Pagado",
  pendiente: "Pendiente",
  devuelto: "Devuelto",
};

export function canManageTeams(role) {
  return role === "super_admin" || role === "admin";
}

export function canManagePlayers(role) {
  return role === "super_admin" || role === "admin" || role === "entrenador";
}

export function canManagePayments(role) {
  return role === "super_admin" || role === "admin";
}

export function isAdminRole(role) {
  return role === "super_admin" || role === "admin";
}

export function isCoachRole(role) {
  return role === "entrenador";
}

export function isPlayerRole(role) {
  return role === "jugador";
}

export function isStaffRole(role) {
  return role && !isPlayerRole(role);
}

export function getDefaultGestionPath(role) {
  if (role === "entrenador") return "/gestion/mi-perfil";
  if (role === "jugador") return "/gestion/mi-ficha";
  return "/gestion";
}

/** Navegación del panel según rol */
export function getGestionNavItems(role) {
  if (role === "entrenador") {
    return [
      { to: "/gestion", label: "Resumen", end: true, icon: "LayoutDashboard" },
      {
        to: "/gestion/mi-perfil",
        label: "Mi perfil",
        end: false,
        icon: "ClipboardList",
      },
      { to: "/gestion/equipos", label: "Mis equipos", icon: "Users" },
      { to: "/gestion/jugadores", label: "Mis jugadores", icon: "UserCircle" },
    ];
  }

  if (role === "jugador") {
    return [
      {
        to: "/gestion/mi-ficha",
        label: "Mi ficha",
        end: true,
        icon: "UserCircle",
      },
    ];
  }

  const items = [
    { to: "/gestion", label: "Resumen", end: true, icon: "LayoutDashboard" },
    { to: "/gestion/mi-cuenta", label: "Mi cuenta", icon: "UserCircle" },
    { to: "/gestion/jugadores", label: "Jugadores", icon: "UserCircle" },
    { to: "/gestion/equipos", label: "Equipos", icon: "Users" },
    {
      to: "/gestion/entrenadores",
      label: "Entrenadores",
      icon: "ClipboardList",
    },
    { to: "/gestion/posts", label: "Posts", icon: "Newspaper" },
    {
      to: "/gestion/post-categories",
      label: "Categorías",
      icon: "Tag",
    },
    { to: "/gestion/contabilidad", label: "Contabilidad", icon: "Wallet" },
  ];

  if (role === "lectura") {
    return items.filter((i) => i.to !== "/gestion/contabilidad");
  }

  if (role === "super_admin") {
    items.push({ to: "/gestion/usuarios", label: "Usuarios", icon: "Shield" });
  }

  return items;
}

export function formatEuro(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("es-ES");
}

export function playerFullName(row) {
  return `${row.apellidos}, ${row.nombre}`;
}
