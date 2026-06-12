import React, { createContext, useContext, useState, useEffect } from 'react';

export type RoleName = string;

export interface PermissionItem {
  view: boolean;
  edit: boolean;
  approval: boolean;
  scope: 'GLOBAL' | 'REGIONAL' | 'READ-ONLY' | 'SILOED';
  sub: string;
}

export interface RolePermissions {
  [pageName: string]: PermissionItem;
}

interface PermissionsContextProps {
  selectedRole: RoleName;
  setSelectedRole: (role: RoleName) => void;
  roles: { name: string; desc: string; active: boolean; users: number }[];
  setRoles: React.Dispatch<React.SetStateAction<{ name: string; desc: string; active: boolean; users: number }[]>>;
  rolePermissions: { [role: string]: RolePermissions };
  updatePermission: (role: RoleName, pageName: string, flag: 'view' | 'edit' | 'approval', value: boolean) => void;
  updateDataSilo: (role: RoleName, pageName: string, scope: 'GLOBAL' | 'REGIONAL' | 'READ-ONLY' | 'SILOED') => void;
  checkPermission: (pageName: string, action: 'view' | 'edit' | 'approval') => boolean;
}

const PermissionsContext = createContext<PermissionsContextProps | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

// Initial default setups for high-fidelity compliance
const initialSuperAdmin: RolePermissions = {
  'Admin Dashboard': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Performance KPIs & Overall Nodes Status' },
  'Payment Methods': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Vodafone Cash, Instapay, Orange Cash' },
  'Wallet Allocation': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Dynamic Smartphone Cash-In Allocations' },
  'Wallet Dashboard': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Smart Flow Rate & Channel Volume Sliders' },
  'Treasury Hub': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Bank Liquidity Logs & Manual Cash Book' },
  'Operator Cockpit': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Node Payout Request Staging Queue' },
  'Local Depositors': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Assigned Collectors & Cash Deposit Stations' },
  'Complaints / Disputes': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'AML Investigations & Dispute Resolutions' },
  'RBAC perms Studio': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Manage Access Scopes & Role Compilation' },
  'Commission Engine': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Multi-Level Referrals & Tiered Fee Splits' },
  'Merchant Dashboard': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Merchant Portal Integration Keys' }
};

const initialOpsManager: RolePermissions = {
  'Admin Dashboard': { view: true, edit: false, approval: false, scope: 'REGIONAL', sub: 'Performance KPIs & Overall Nodes Status' },
  'Payment Methods': { view: true, edit: true, approval: false, scope: 'REGIONAL', sub: 'Vodafone Cash, Instapay, Orange Cash' },
  'Wallet Allocation': { view: true, edit: true, approval: true, scope: 'REGIONAL', sub: 'Dynamic Smartphone Cash-In Allocations' },
  'Wallet Dashboard': { view: true, edit: true, approval: true, scope: 'REGIONAL', sub: 'Smart Flow Rate & Channel Volume Sliders' },
  'Treasury Hub': { view: false, edit: false, approval: false, scope: 'SILOED', sub: 'Bank Liquidity Logs & Manual Cash Book' },
  'Operator Cockpit': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Node Payout Request Staging Queue' },
  'Local Depositors': { view: true, edit: true, approval: false, scope: 'REGIONAL', sub: 'Assigned Collectors & Cash Deposit Stations' },
  'Complaints / Disputes': { view: true, edit: true, approval: false, scope: 'REGIONAL', sub: 'AML Investigations & Dispute Resolutions' },
  'RBAC perms Studio': { view: true, edit: false, approval: false, scope: 'REGIONAL', sub: 'Manage Access Scopes & Role Compilation' },
  'Commission Engine': { view: true, edit: true, approval: false, scope: 'REGIONAL', sub: 'Multi-Level Referrals & Tiered Fee Splits' },
  'Merchant Dashboard': { view: true, edit: true, approval: false, scope: 'REGIONAL', sub: 'Merchant Portal Integration Keys' }
};

const initialFinance: RolePermissions = {
  'Admin Dashboard': { view: true, edit: false, approval: false, scope: 'GLOBAL', sub: 'Performance KPIs & Overall Nodes Status' },
  'Payment Methods': { view: true, edit: false, approval: false, scope: 'GLOBAL', sub: 'Vodafone Cash, Instapay, Orange Cash' },
  'Wallet Allocation': { view: true, edit: false, approval: false, scope: 'READ-ONLY', sub: 'Dynamic Smartphone Cash-In Allocations' },
  'Wallet Dashboard': { view: true, edit: false, approval: false, scope: 'READ-ONLY', sub: 'Smart Flow Rate & Channel Volume Sliders' },
  'Treasury Hub': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Bank Liquidity Logs & Manual Cash Book' },
  'Operator Cockpit': { view: true, edit: false, approval: true, scope: 'GLOBAL', sub: 'Node Payout Request Staging Queue' },
  'Local Depositors': { view: true, edit: false, approval: false, scope: 'GLOBAL', sub: 'Assigned Collectors & Cash Deposit Stations' },
  'Complaints / Disputes': { view: false, edit: false, approval: false, scope: 'SILOED', sub: 'AML Investigations & Dispute Resolutions' },
  'RBAC perms Studio': { view: true, edit: false, approval: false, scope: 'READ-ONLY', sub: 'Manage Access Scopes & Role Compilation' },
  'Commission Engine': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Multi-Level Referrals & Tiered Fee Splits' },
  'Merchant Dashboard': { view: true, edit: false, approval: false, scope: 'GLOBAL', sub: 'Merchant Portal Integration Keys' }
};

const initialRiskCompliance: RolePermissions = {
  'Admin Dashboard': { view: true, edit: false, approval: false, scope: 'GLOBAL', sub: 'Performance KPIs & Overall Nodes Status' },
  'Payment Methods': { view: true, edit: false, approval: false, scope: 'GLOBAL', sub: 'Vodafone Cash, Instapay, Orange Cash' },
  'Wallet Allocation': { view: false, edit: false, approval: false, scope: 'SILOED', sub: 'Dynamic Smartphone Cash-In Allocations' },
  'Wallet Dashboard': { view: false, edit: false, approval: false, scope: 'SILOED', sub: 'Smart Flow Rate & Channel Volume Sliders' },
  'Treasury Hub': { view: true, edit: false, approval: false, scope: 'GLOBAL', sub: 'Bank Liquidity Logs & Manual Cash Book' },
  'Operator Cockpit': { view: true, edit: false, approval: false, scope: 'GLOBAL', sub: 'Node Payout Request Staging Queue' },
  'Local Depositors': { view: true, edit: false, approval: false, scope: 'GLOBAL', sub: 'Assigned Collectors & Cash Deposit Stations' },
  'Complaints / Disputes': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'AML Investigations & Dispute Resolutions' },
  'RBAC perms Studio': { view: true, edit: false, approval: false, scope: 'REGIONAL', sub: 'Manage Access Scopes & Role Compilation' },
  'Commission Engine': { view: false, edit: false, approval: false, scope: 'SILOED', sub: 'Multi-Level Referrals & Tiered Fee Splits' },
  'Merchant Dashboard': { view: true, edit: false, approval: false, scope: 'GLOBAL', sub: 'Merchant Portal Integration Keys' }
};

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [selectedRole, setSelectedRole] = useState<RoleName>(() => {
    return localStorage.getItem('finlux_selected_role') || 'Super Admin';
  });

  const [roles, setRoles] = useState<{ name: string; desc: string; active: boolean; users: number }[]>(() => {
    const saved = localStorage.getItem('finlux_roles');
    return saved ? JSON.parse(saved) : [
      { name: 'Super Admin', desc: 'Full Global Access', active: true, users: 12 },
      { name: 'Ops Manager', desc: 'Regional Control', active: true, users: 240 },
      { name: 'Finance', desc: 'Treasury & Ledger', active: true, users: 48 },
      { name: 'Risk & Compliance', desc: 'KYC/AML Scope', active: true, users: 15 }
    ];
  });

  const [rolePermissions, setRolePermissions] = useState<{ [role: string]: RolePermissions }>(() => {
    const saved = localStorage.getItem('finlux_role_permissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing role permissions", e);
      }
    }
    return {
      'Super Admin': { ...initialSuperAdmin },
      'Ops Manager': { ...initialOpsManager },
      'Finance': { ...initialFinance },
      'Risk & Compliance': { ...initialRiskCompliance }
    };
  });

  // Save changes to localstorage to survive reloads
  useEffect(() => {
    localStorage.setItem('finlux_selected_role', selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    localStorage.setItem('finlux_roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('finlux_role_permissions', JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  const updatePermission = (role: RoleName, pageName: string, flag: 'view' | 'edit' | 'approval', value: boolean) => {
    setRolePermissions(prev => {
      const currentRolePerms = prev[role] || { ...initialSuperAdmin };
      const currentItem = currentRolePerms[pageName] || { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: '' };
      
      return {
        ...prev,
        [role]: {
          ...currentRolePerms,
          [pageName]: {
            ...currentItem,
            [flag]: value
          }
        }
      };
    });
  };

  const updateDataSilo = (role: RoleName, pageName: string, scope: 'GLOBAL' | 'REGIONAL' | 'READ-ONLY' | 'SILOED') => {
    setRolePermissions(prev => {
      const currentRolePerms = prev[role] || { ...initialSuperAdmin };
      const currentItem = currentRolePerms[pageName] || { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: '' };

      return {
        ...prev,
        [role]: {
          ...currentRolePerms,
          [pageName]: {
            ...currentItem,
            scope
          }
        }
      };
    });
  };

  const checkPermission = (pageName: string, action: 'view' | 'edit' | 'approval'): boolean => {
    const activePerms = rolePermissions[selectedRole];
    if (!activePerms) return true; // Default fallthrough to true if unknown role
    const item = activePerms[pageName];
    if (!item) return true; // Default if not found
    return item[action];
  };

  return (
    <PermissionsContext.Provider value={{
      selectedRole,
      setSelectedRole,
      roles,
      setRoles,
      rolePermissions,
      updatePermission,
      updateDataSilo,
      checkPermission
    }}>
      {children}
    </PermissionsContext.Provider>
  );
}
