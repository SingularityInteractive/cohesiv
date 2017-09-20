import { Observable } from 'rxjs'
import * as PBAC from 'pbac'
import AccessStatement from '../../cohesiv/models/access_statement'
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

export default class Access {
  protected static ValidateAction(policies: Policy[], action: any): boolean {
    return new PBAC(policies).evaluate(action)
  }
  public evaluate(request: pb.AccessRequest): Observable<pb.AccessResponse> {
    const policies: Policy[] = [policiesByNamespace.default]
    if (policiesByNamespace[request.namespace])
      policies.push(policiesByNamespace[request.namespace])
    if (policiesByUserID[request.user_id]) policies.push(policiesByUserID[request.user_id])
    const action: Action = {
      action: request.action.action,
      resource: request.action.resource,
      variables: {
        req: {
          Namespace: request.namespace,
          UserID: request.user_id
        }
      }
    }
    return Observable.of({
      valid: Access.ValidateAction(policies, action)
    })
  }

  public evaluateMany(request: pb.ManyAccessRequest): Observable<pb.AccessResponse> {
    const valid = request.actions
      .map((resourceAction: pb.ResourceAction) => {
        const policies: Policy[] = [policiesByNamespace.default]
        if (policiesByNamespace[request.namespace])
          policies.push(policiesByNamespace[request.namespace])
        if (policiesByUserID[request.user_id]) policies.push(policiesByUserID[request.user_id])
        const action: Action = {
          action: resourceAction.action,
          resource: resourceAction.resource,
          variables: {
            req: {
              Namespace: request.namespace,
              UserID: request.user_id
            }
          }
        }
        return Access.ValidateAction(policies, action)
      })
      .every(Boolean)
    return Observable.of({
      valid
    })
  }
}
