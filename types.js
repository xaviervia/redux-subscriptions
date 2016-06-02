export type Action = {
  type: string,
  payload: any
}

export type Difference = {
  before: any,
  after: any
}

export type SubscriptionArguments = {
  dispatch: (action: Action) => void,
  getDiff: (prev: Object, next: Object) => Difference
  newState: Object,
  prevState: Object
}

export type Subscription = (SubscriptionArguments) => Action
