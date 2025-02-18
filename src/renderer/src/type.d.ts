export interface IRole {
  id: number,
  label: string,
  code: string
}

export interface IUser {
  id?: number,
  email: string,
  password?: string,
  first_name: string,
  last_name: string,
  created_at?: string,
  login?: string,
  role?: IRole,
  role_id: number | null
}

export interface ILogin {
  email: string | null,
  password: string | null
}

export interface IResponse {
  message: string,
  status: number,
  errors: string[],
  data: any | null
}

export interface INotification {
  id: string,
  message: string,
  data: any
}

export interface IChangePassword {
  new_password: string | null,
  confirm_password: string | null,
  old_password?: string | null,
}

export interface ICategory {
  id?: number,
  code: string,
  label?: string
}

export interface IOrganization {
  id?: number,
  label?: string,
  header?: string,
  capital?: string,
  status?: string
}

export interface IHolder {
  id?: number,
  first_name?: string,
  last_name?: string,
  shares?: number,
  value?: number,
  percent?: number,
  capital?: number,
  current?: boolean,
  created_at?: string
  organization_id?: number,
  ligne?: number,
  oragization?: IOrganization
}

export interface IIntermediary {
  id?: number,
  label: string,
  head: string,
  approval_number: string,
  approval_date: string,
  leader_name?: string,
  leader_status?: string,
  approval_number_two?: string,
  approval_date_two?: string,
  adress?: string,
  contacts?: string
  category_id?: number,
  category?: ICategory
  organization_id?: number,
  organization?: IOrganization
}

export interface ISearchIntermediary {
  term?: string | null,
  category_id?: number | null
}

export interface IVisaApplication {
  id?: number,
  label?: string,
  reason?: string,
  status?: string,
  other?: string,
  intermediary_id?: number,
  decision?: string,
  created_at?: string
}

export interface ITypeOpc {
  id?: number,
  code?: string,
  label?: string
}

export interface ITypeOpc {
  id?: number,
  code?: string,
  label?: string
}

export interface IDepository {
  id?: number,
  code?: string,
  label?: string
}
export interface IClassification {
  id?: number,
  code?: string,
  label?: string
}
export interface IDistribution {
  id?: number,
  code?: string,
  label?: string
}
export interface IFund {
  id?: number,
  label?: string,
  approval_number?: string,
  approval_date?: string,
  other?: string,
  distribution_network?: string,
  type_opc_id?: number,
  typeOpc?: ITypeOpc,
  classification_id?: number,
  classification?: IClassification,
  depositary_id?: number,
  depositary?: IDepository,
  distribution_id?: number,
  distribution?: IDistribution,
  intermediary_id?: number,
  intermediary?: IIntermediary,
  auditor_id?: number,
  auditor?: IIntermediary
}

export interface IYear {
  id?: number,
  code?: string,
  label?: string,
  generated?: boolean,
  active?: boolean
}

export interface IWeek {
  id?: number,
  label?: string,
  month?: string,
  number?: number,
  start?: string,
  end?: string,
  year?: IYear
}

export interface IAssetLineType {
  id?: number,
  label?: string,
  code?: string
}

export interface IOpc {
  id?: number,
  created_at?: string,
  estimated_at?: string,
  fundId?: number,
  fund?: IFund,
  week_id?: number,
  week?: IWeek,
  opcvms?: Iopcvm[],
  investmentRules?: IInvestmentRule[],
  sgoEmployees?: ISgoEmployee[],
  assetLines?: IAssetLine[],
  investors?: IInvestor[]
}

export interface IOpcvmType {
  id?: number,
  label?: string,
  code?: string,
  parent_id?: number,
  parent?: IOpcvmType
}

export interface IInvestmentRuleType {
  id?: number,
  label?: string,
  code?: string
}

export interface IInvestor {
  id?: number,
  label?: string,
  value?: number,
  percent?: number,
  unit?: string,
  qualified?: boolean,
  opcId?: number,
  opc?: IOpc
}

export interface ISgoEmployee {
  id?: number,
  label?: string,
  quality?: string,
  part?: number,
  percent?: number
  opcId?: number
  opc?: Iopc
}

export interface IInvestmentRule {
  id?: number,
  label?: string,
  value?: number,
  percent?: number,
  status?: string,
  rule_type_id?: number,
  ruleType?: IInvestmentRuleType,
  opcId?: number,
  opc?: IOpc
}

export interface IAssetLine {
  id?: number,
  label?: string,
  value?: number,
  percent?: number,
  assetTypeId?: number,
  assetType?: IAssetLineType
}

export interface Iopcvm {
  id?: number,
  label?: string,
  number?: number,
  cours?: number,
  value?: number,
  percent?: number,
  status?: string,
  typeId?: number
  type?: IOpcvmType,
  opcId?: number,
  opc?: IOpc
}

export interface ISysInfo {
  year?: IYear,
  weeks?: IWeek[],
  currentWeek?: IWeek
}

export interface IFollowRule {
  id?: number,
  reference?: string,
  label?: string,
  code?: string,
  periodicity?: string,
  observation?: string,
  regulatory_date?: string,
  parent_id?: number,
  parent?: IFollowRule,
  subRules?: IFollowRule[]
}

export interface IFollowFund {
  id?: number,
  standard?: boolean,
  value?: string,
  status?: string,
  week_id?: number,
  week?: IWeek,
  fund_id?: number,
  fund?: IFund
}

