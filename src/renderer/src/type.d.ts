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
  id?: number | null,
  label?: string,
  header?: string,
  capital?: double,
  status?: string | null
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
  organization?: IOrganization,
  countFund: number,
  countMandatory: number
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
  label?: string,
  subType?: ITypeOpc[]
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
  date?: string,
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
  investmentRuleType?: IInvestmentRuleType,
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
  opcvmType?: IOpcvmType,
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
  fund?: IFund,
  rule?: IFollowRule
}

export interface IHolderGrouped {
  label: string,
  holders: IHolder[]
}

export interface IReportNote {
  label: string,
  notation: number,
  note: string,
  items?: IFollowFund[]
}

export interface IRequestHistoryLiquidationValue {
  date_to?: string | null,
  date_at?: string | null,
  fund_id: number
}

export interface IHistoryLiquidationValue {
  label: string,
  value: number,
  percent: number,
  period: string
}

export interface IShareholderType {
  id?: number,
  label: string,
  code: string
  subTypes?: IShareholderType[]
}

export interface IOperationType {
  id?: number,
  label: string,
  code: string,
}

export interface IOperation {
  id?: number,
  shares: number,
  percent: number,
  amount: number,
  created_at?: string,
  type?: IOperationType
}

export interface IShareholder {
  id?: number,
  label: string,
  nationality?: string,
  residence?: string,
  id_number?: string,
  pp?: string,
  type?: IShareholderType,
  type_id?: number,
  shares?: number,
  amount?: number,
  percent?: number,
  fund_id?: number,
  operation_id?: number,
  operations?: IOperation[]
}

export interface IHistoryShareholder {
  id?: number,
  date_start?: string,
  date_end?: string,
  shareholder?: IShareholder,
  fund?: IFund
}

export interface IShareHolderOperation {
  label: string,
  id: number,
  amount: number,
  shares: number,
  percent: number
}

export interface ICustomer {
  id?: int,
  label?: string,
  status?: string
  intermediary?: IIntermediary
}

export interface IMandate {
  id?: number,
  strategy?: string,
  risk_profile?: string,
  created_at?: string,
  date?: string,
  opcvms?: Iopcvm[],
  assetLines?: IAssetLine[],
  week?: IWeek,
  customer?: ICustomer,
  depositary?: IDepository
}

export interface IDocument {
  id?: number,
  path?: string,
  label?: string,
  url?: string,
  type?: string,
  created_at?: string,
  size?: number
}

export interface IReqFindFundByRatio {
  rule_id: number,
  sub_rule_id: number,
  standard: boolean
}

export interface IFundWithFollowRule {
  fund: IFund,
  rule: IFollowRule,
  risk: number,
  observation: string
}

export interface IDashActifs {
  countSgo: number,
  totalActifs: number,
  actifsFund: number,
  actifsMandate: number
}

export interface IDashLiquidative {
  label: string,
  value: number
}

export interface IPeriodicity {
  id: number,
  label: string,
  code: string
}

export interface ITypeComponentReport {
  id: number,
  label: string,
  code: string
}

export interface IReportComponent {
  id: number,
  created_at: string,
  label: string,
  value: number,
  value_1: number,
  value_2: number,
  type: ITypeComponentReport
}

export interface IReportSGO {
  id: number,
  created_at: string,
  date: string,
  intermediary: IIntermediary,
  intermediary_check?: IIntermediary,
  periodicity: IPeriodicity,
  components: IReportComponent[]
}

export interface IFileElement {
  ligne: number,
  file: File,
  observation: string,
  loading: boolean,
  type: string,
  success: boolean
}

export interface ISearchFund {
  intermediary_id: number | null,
  term: string | null
}