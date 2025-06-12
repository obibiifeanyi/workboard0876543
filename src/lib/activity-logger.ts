import { supabase } from '@/integrations/supabase/client';

export type ActivityType =
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'user.login'
  | 'user.logout'
  | 'department.created'
  | 'department.updated'
  | 'department.deleted'
  | 'document.uploaded'
  | 'document.updated'
  | 'document.deleted'
  | 'document.accessed'
  | 'form.created'
  | 'form.updated'
  | 'form.deleted'
  | 'form.submitted'
  | 'task.created'
  | 'task.updated'
  | 'task.deleted'
  | 'task.assigned'
  | 'task.completed'
  | 'clock.in'
  | 'clock.out'
  | 'notification.sent'
  | 'permission.granted'
  | 'permission.revoked';

interface ActivityMetadata {
  [key: string]: any;
}

interface ActivityTarget {
  id: string;
  type: string;
}

export async function logActivity(
  type: ActivityType,
  actorId: string,
  details: string,
  metadata: ActivityMetadata = {},
  target?: ActivityTarget
) {
  try {
    // Validate required fields
    if (!type || !actorId || !details) {
      console.error('Missing required fields for activity logging:', { type, actorId, details });
      return;
    }

    // Prepare the activity data
    const activityData = {
      type,
      actor_id: actorId,
      details,
      metadata,
      ...(target && {
        target_id: target.id,
        target_type: target.type,
      }),
    };

    // Insert the activity
    const { error } = await supabase
      .from('system_activities')
      .insert(activityData);

    if (error) {
      console.error('Error logging activity:', error);
      // Don't throw the error to prevent disrupting the main flow
      return;
    }

    // Log success in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Activity logged successfully:', activityData);
    }
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw the error to prevent disrupting the main flow
  }
}

// Helper functions for common activities
export const ActivityLogger = {
  // User activities
  logUserCreated: (actorId: string, userId: string, userEmail: string) =>
    logActivity(
      'user.created',
      actorId,
      `Created new user: ${userEmail}`,
      { userId },
      { id: userId, type: 'user' }
    ),

  logUserUpdated: (actorId: string, userId: string, userEmail: string, changes: string[]) =>
    logActivity(
      'user.updated',
      actorId,
      `Updated user: ${userEmail}`,
      { userId, changes },
      { id: userId, type: 'user' }
    ),

  logUserDeleted: (actorId: string, userId: string, userEmail: string) =>
    logActivity(
      'user.deleted',
      actorId,
      `Deleted user: ${userEmail}`,
      { userId },
      { id: userId, type: 'user' }
    ),

  logUserLogin: (userId: string, userEmail: string) =>
    logActivity(
      'user.login',
      userId,
      `User logged in: ${userEmail}`,
      { userEmail },
      { id: userId, type: 'user' }
    ),

  logUserLogout: (userId: string, userEmail: string) =>
    logActivity(
      'user.logout',
      userId,
      `User logged out: ${userEmail}`,
      { userEmail },
      { id: userId, type: 'user' }
    ),

  // Department activities
  logDepartmentCreated: (actorId: string, deptId: string, deptName: string) =>
    logActivity(
      'department.created',
      actorId,
      `Created department: ${deptName}`,
      { deptId },
      { id: deptId, type: 'department' }
    ),

  logDepartmentUpdated: (actorId: string, deptId: string, deptName: string, changes: string[]) =>
    logActivity(
      'department.updated',
      actorId,
      `Updated department: ${deptName}`,
      { deptId, changes },
      { id: deptId, type: 'department' }
    ),

  logDepartmentDeleted: (actorId: string, deptId: string, deptName: string) =>
    logActivity(
      'department.deleted',
      actorId,
      `Deleted department: ${deptName}`,
      { deptId },
      { id: deptId, type: 'department' }
    ),

  // Document activities
  logDocumentUploaded: (actorId: string, docId: string, docName: string, deptId: string) =>
    logActivity(
      'document.uploaded',
      actorId,
      `Uploaded document: ${docName}`,
      { docId, deptId },
      { id: docId, type: 'document' }
    ),

  logDocumentUpdated: (actorId: string, docId: string, docName: string, changes: string[]) =>
    logActivity(
      'document.updated',
      actorId,
      `Updated document: ${docName}`,
      { docId, changes },
      { id: docId, type: 'document' }
    ),

  logDocumentDeleted: (actorId: string, docId: string, docName: string) =>
    logActivity(
      'document.deleted',
      actorId,
      `Deleted document: ${docName}`,
      { docId },
      { id: docId, type: 'document' }
    ),

  logDocumentAccessed: (actorId: string, docId: string, docName: string) =>
    logActivity(
      'document.accessed',
      actorId,
      `Accessed document: ${docName}`,
      { docId },
      { id: docId, type: 'document' }
    ),

  // Form activities
  logFormCreated: (actorId: string, formId: string, formTitle: string, deptId: string) =>
    logActivity(
      'form.created',
      actorId,
      `Created form: ${formTitle}`,
      { formId, deptId },
      { id: formId, type: 'form' }
    ),

  logFormUpdated: (actorId: string, formId: string, formTitle: string, changes: string[]) =>
    logActivity(
      'form.updated',
      actorId,
      `Updated form: ${formTitle}`,
      { formId, changes },
      { id: formId, type: 'form' }
    ),

  logFormDeleted: (actorId: string, formId: string, formTitle: string) =>
    logActivity(
      'form.deleted',
      actorId,
      `Deleted form: ${formTitle}`,
      { formId },
      { id: formId, type: 'form' }
    ),

  logFormSubmitted: (actorId: string, formId: string, formTitle: string, submissionId: string) =>
    logActivity(
      'form.submitted',
      actorId,
      `Submitted form: ${formTitle}`,
      { formId, submissionId },
      { id: formId, type: 'form' }
    ),

  // Task activities
  logTaskCreated: (actorId: string, taskId: string, taskTitle: string, assigneeId: string) =>
    logActivity(
      'task.created',
      actorId,
      `Created task: ${taskTitle}`,
      { taskId, assigneeId },
      { id: taskId, type: 'task' }
    ),

  logTaskUpdated: (actorId: string, taskId: string, taskTitle: string, changes: string[]) =>
    logActivity(
      'task.updated',
      actorId,
      `Updated task: ${taskTitle}`,
      { taskId, changes },
      { id: taskId, type: 'task' }
    ),

  logTaskDeleted: (actorId: string, taskId: string, taskTitle: string) =>
    logActivity(
      'task.deleted',
      actorId,
      `Deleted task: ${taskTitle}`,
      { taskId },
      { id: taskId, type: 'task' }
    ),

  logTaskAssigned: (actorId: string, taskId: string, taskTitle: string, assigneeId: string) =>
    logActivity(
      'task.assigned',
      actorId,
      `Assigned task: ${taskTitle}`,
      { taskId, assigneeId },
      { id: taskId, type: 'task' }
    ),

  logTaskCompleted: (actorId: string, taskId: string, taskTitle: string) =>
    logActivity(
      'task.completed',
      actorId,
      `Completed task: ${taskTitle}`,
      { taskId },
      { id: taskId, type: 'task' }
    ),

  // Clock activities
  logClockIn: (userId: string, location: { latitude: number; longitude: number }) =>
    logActivity(
      'clock.in',
      userId,
      'Clocked in',
      { location },
      { id: userId, type: 'user' }
    ),

  logClockOut: (userId: string, location: { latitude: number; longitude: number }) =>
    logActivity(
      'clock.out',
      userId,
      'Clocked out',
      { location },
      { id: userId, type: 'user' }
    ),

  // Notification activities
  logNotificationSent: (actorId: string, recipientId: string, notificationType: string) =>
    logActivity(
      'notification.sent',
      actorId,
      `Sent ${notificationType} notification`,
      { recipientId },
      { id: recipientId, type: 'user' }
    ),

  // Permission activities
  logPermissionGranted: (actorId: string, targetId: string, permission: string) =>
    logActivity(
      'permission.granted',
      actorId,
      `Granted ${permission} permission`,
      { targetId, permission },
      { id: targetId, type: 'user' }
    ),

  logPermissionRevoked: (actorId: string, targetId: string, permission: string) =>
    logActivity(
      'permission.revoked',
      actorId,
      `Revoked ${permission} permission`,
      { targetId, permission },
      { id: targetId, type: 'user' }
    ),
};
