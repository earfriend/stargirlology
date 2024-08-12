import type { ACLPermissions } from '~/model/user/ACLPermissions';
import type SGUser from '~/model/user/SGUser';

type BeforeNavigate = ({ newUser }: { newUser: SGUser }) => Promise<void>;

/**
 * Watch a permission and navigate to login if not permitted.
 * @param permission The permission required of the user.
 * @param beforeNavigate A function to run before navigating to login.
 * @param user The user to watch.
 * @returns Whether the user is permitted when the function first runs.
 */
const watchPermission = ({
  permission,
  beforeNavigate,
  user,
}: {
  permission: ACLPermissions,
  beforeNavigate?: BeforeNavigate,
  user: Ref<SGUser>,
}): boolean => {
  console.log(`Watching permission: ${permission}`);


  const uwHandle = watch(
    user,
    async (newUser) => {
      if (!newUser.acl.isPermitted(permission)) {
        if (beforeNavigate) {
          await beforeNavigate({ newUser });
        }
        uwHandle();
        navigateTo('/auth/login');
      }
    },
    { immediate: true }
  );


  onUnmounted(() => {
    uwHandle();
  });
  return user.value.acl.isPermitted(permission);
};

export default function() {

  return {
    watchPermission,
  };
}