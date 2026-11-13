export function allowedActions(target, actor) {
  const isSelf = target.id === actor.id
  const targetIsAdmin = target.role === 'ADMIN'
  const actorIsOwner = Boolean(actor.isOwner)

  return {
    edit: !targetIsAdmin || actorIsOwner || isSelf,
    toggleStatus: !isSelf && !target.isOwner && (!targetIsAdmin || actorIsOwner),
    remove: !isSelf && !targetIsAdmin,
    promote: actorIsOwner && target.role === 'STAFF',
    demote: actorIsOwner && targetIsAdmin && !target.isOwner,
  }
}