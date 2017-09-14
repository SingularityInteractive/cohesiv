import AccessStatement from '../../cohesiv/models/access_statement'
import * as PBAC from 'pbac'
import { cohesiv as pb } from '../../cohesiv/cohesiv'
import log from './log'

const policiesByNamespace: { [namespace: string]: Policy } = {
  default: {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'OptionalDescription',
        Effect: 'Allow',
        Action: [
          'tagdirectory:GetTags',
          'tagdirectory:CreateTags',
          'tagdirectory:GetResourcesByTagName'
        ],
        Resource: ['io:cohesiv:tagdirectory:default/*', 'io:cohesiv:tagdirectory:default/*']
      }
    ]
  },
  gloo: {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'OptionalDescription',
        Effect: 'Allow',
        Action: [
          'tagdirectory:GetTags',
          'tagdirectory:CreateTags',
          'tagdirectory:GetResourcesByTagName'
        ],
        Resource: ['io:cohesiv:tagdirectory:gloo/*', 'io:cohesiv:tagdirectory:gloo/*']
      },
      {
        Sid: 'OptionalDescription',
        Effect: 'Allow',
        Action: ['tagdirectory:GetTags'],
        Resource: ['io:cohesiv:tagdirectory:mypds/*']
      }
    ]
  },
  mypds: {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'OptionalDescription',
        Effect: 'Allow',
        Action: [
          'tagdirectory:GetTags',
          'tagdirectory:CreateTags',
          'tagdirectory:GetResourcesByTagName'
        ],
        Resource: ['io:cohesiv:tagdirectory:mypds/*', 'io:cohesiv:tagdirectory:mypds/*']
      }
    ]
  }
}

const policiesByUserID: { [namespace: string]: Policy } = {
  user1: {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'OptionalDescription',
        Effect: 'Deny',
        Action: ['tagdirectory:GetTags'],
        Resource: ['io:cohesiv:tagdirectory:gloo/cat']
      }
    ]
  },
  user2: {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'OptionalDescription',
        Effect: 'Deny',
        Action: ['tagdirectory:CreateTags'],
        Resource: ['io:cohesiv:tagdirectory:mypds/*']
      }
    ]
  }
}

declare interface EvaluateCall {
  request: pb.AccessRequest
}

declare interface EvaluateManyCall {
  request: pb.ManyAccessRequest
}

export default class Access {
  protected static ValidateAction(policies: Policy[], action: any): boolean {
    return new PBAC(policies).evaluate(action)
  }
  public evaluate(call: EvaluateCall, callback: (err: Error, res: pb.AccessResponse) => void) {
    const policies: Policy[] = [policiesByNamespace.default]
    if (policiesByNamespace[call.request.namespace])
      policies.push(policiesByNamespace[call.request.namespace])
    if (policiesByUserID[call.request.user_id])
      policies.push(policiesByUserID[call.request.user_id])
    const action: Action = {
      action: call.request.action.action,
      resource: call.request.action.resource,
      variables: {
        req: {
          Namespace: call.request.namespace,
          UserID: call.request.user_id
        }
      }
    }
    callback(undefined, {
      valid: Access.ValidateAction(policies, action)
    })
  }

  public evaluateMany(
    call: EvaluateManyCall,
    callback: (err: Error, res: pb.AccessResponse) => void
  ) {
    const valid = call.request.actions
      .map((resourceAction: pb.ResourceAction) => {
        const policies: Policy[] = [policiesByNamespace.default]
        if (policiesByNamespace[call.request.namespace])
          policies.push(policiesByNamespace[call.request.namespace])
        if (policiesByUserID[call.request.user_id])
          policies.push(policiesByUserID[call.request.user_id])
        const action: Action = {
          action: resourceAction.action,
          resource: resourceAction.resource,
          variables: {
            req: {
              Namespace: call.request.namespace,
              UserID: call.request.user_id
            }
          }
        }
        return Access.ValidateAction(policies, action)
      })
      .every(Boolean)
    return callback(undefined, {
      valid
    })
  }
}
