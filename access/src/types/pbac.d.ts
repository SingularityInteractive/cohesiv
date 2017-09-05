declare module 'pbac'

declare interface Action {
  action: string
  resource: string
  variables?: { [key: string]: { [key: string]: string } }
}

declare interface Policy {
  Version: string
  Statement: Statement[]
}

declare interface Statement {
  Sid: string
  Effect: string
  Action: string[]
  Resource: string[]
  Condition?: Condition
}

declare interface Condition {
  NumericEquals?: { [argument: string]: number }
  NumericNotEquals?: { [argument: string]: number }
  NumericLessThan?: { [argument: string]: number }
  NumericGreaterThanEquals?: { [argument: string]: number }
  NumericGreaterThan?: { [argument: string]: number }
  NumericLessThanEquals?: { [argument: string]: number }
  DateEquals?: { [argument: string]: string }
  DateNotEquals?: { [argument: string]: string }
  DateLessThan?: { [argument: string]: string }
  DateGreaterThanEquals?: { [argument: string]: string }
  DateGreaterThan?: { [argument: string]: string }
  DateLessThanEquals?: { [argument: string]: string }
  BinaryEquals?: { [argument: string]: string }
  BinaryNotEquals?: { [argument: string]: string }
  Null?: { [argument: string]: string }
  IpAddress?: { [argument: string]: string }
  NotIpAddress?: { [argument: string]: string }
  StringEquals?: { [argument: string]: string }
  StringNotEquals?: { [argument: string]: string }
  StringEqualsIgnoreCase?: { [argument: string]: string }
  StringNotEqualsIgnoreCase?: { [argument: string]: string }
  StringLike?: { [argument: string]: string }
  StringNotLike?: { [argument: string]: string }
  Bool?: { [argument: string]: boolean }
}
