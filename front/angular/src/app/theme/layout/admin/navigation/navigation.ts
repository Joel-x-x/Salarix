export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/analytics',
        icon: 'feather icon-home'
      }
    ]
  },
  {
    id: 'ui-component',
    title: 'Ui Component',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'basic',
        title: 'Component',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/component/button'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/component/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/component/breadcrumb-paging'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/component/collapse'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/component/tabs-pills'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/component/typography'
          }
        ]
      }
    ]
  },
  {
    id: 'Empleados',
    title: 'Empleados',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
      id: 'Empleados',
      title: 'Empleados',
      type: 'collapse',
      icon: 'icon-group',
      children: [
        {
          id: 'registros',
          title: 'Registros',
          type: 'item',
          url: '/registros',
          icon: 'feather icon-clock',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'empleado',
          title: 'Empleado',
          type: 'item',
          url: '/empleado',
          icon: 'feather icon-users',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'posicion',
          title: 'Posicion',
          type: 'item',
          url: '/posicion',
          icon: 'feather icon-shield',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'plan-salarial',
          title: 'Plan salarial',
          type: 'item',
          url: '/plan-salarial',
          icon: 'feather icon-book',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'departamentos',
          title: 'Departamentos',
          type: 'item',
          url: '/departamentos',
          icon: 'feather icon-grid',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'dependientes',
          title: 'Dependientes',
          type: 'item',
          url: '/dependientes',
          icon: 'feather icon-user-plus',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'vacaciones',
          title: 'Vacaciones',
          type: 'item',
          url: '/vacaciones',
          icon: 'feather icon-link-2',
          target: false,
          breadcrumbs: true
        }
      ]
      },
    ]
  },
  {
    id: 'Nomina',
    title: 'Nomina',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'nomina',
        title: 'Nomina',
        type: 'item',
        url: '/nomina',
        icon: 'feather icon-link',
        target: false,
        breadcrumbs: true
      }
    ]
  },
  {
    id: 'Reportes',
    title: 'Reportes',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'reportes',
        title: 'Reportes',
        type: 'item',
        url: '/reportes',
        icon: 'feather icon-clipboard',
        target: false,
        breadcrumbs: true
      }
    ]
  },
  {
    id: 'Authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'signup',
        title: 'Sign up',
        type: 'item',
        url: '/auth/signup',
        icon: 'feather icon-at-sign',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'signin',
        title: 'Sign in',
        type: 'item',
        url: '/auth/signin',
        icon: 'feather icon-log-in',
        target: true,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'chart',
    title: 'Chart',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'apexchart',
        title: 'ApexChart',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },
  {
    id: 'forms & tables',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'forms',
        title: 'Basic Forms',
        type: 'item',
        url: '/forms',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'tables',
        title: 'tables',
        type: 'item',
        url: '/tables',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'menu-level',
        title: 'Menu Levels',
        type: 'collapse',
        icon: 'feather icon-menu',
        children: [
          {
            id: 'menu-level-2.1',
            title: 'Menu Level 2.1',
            type: 'item',
            url: 'javascript:',
            external: true
          },
          {
            id: 'menu-level-2.2',
            title: 'Menu Level 2.2',
            type: 'collapse',
            children: [
              {
                id: 'menu-level-2.2.1',
                title: 'Menu Level 2.2.1',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-2.2.2',
                title: 'Menu Level 2.2.2',
                type: 'item',
                url: 'javascript:',
                external: true
              }
            ]
          }
        ]
      }
    ]
  }
];
