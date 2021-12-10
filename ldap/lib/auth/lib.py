################################################################################
# Author:     Thomas D'haenens
# License:    GPL-3.0
# Link:       https://github.com/BENEATLY/neat-community-plugins/
# Contact:    https://neatly.be/
################################################################################


# IMPORT: Standard Modules
import ldap                                                                                 # LDAP Lib

# IMPORT: Custom Modules
from plugins import readOptionDictByPlugin                                                  # Plugin Lib
from basic import traceback, log                                                            # Basic Lib


# CONFIGURATION: Plugin
pluginConfig = {'plugin': {'id': 5, 'name': 'LDAP'}}


# FUNCTION: Authentication Log Entry
@log()
def authLogEntry(user, message):
    return (user.userName.upper() + ' - ' + message)


# FUNCTION: Valid Authenticate Configuration
@log(returnValue=False)
def validAuthConfig(pluginOptions):
    if (not pluginOptions['Connection']['url']):
        _logger.warning('No LDAP URL ("Connection" group) defined')
        return False
    if (not pluginOptions['Connection']['url'].startswith(('ldap://', 'ldaps://'))):
        _logger.warning('The LDAP URL ("Connection" group) does not start with "ldap://" or "ldaps://"')
        return False
    if (not pluginOptions['Connection']['protocol']):
        _logger.warning('No LDAP Protocol ("Connection" group) defined')
        return False
    return True


# FUNCTION: Authenticate
def authenticate(execParams, plugin, user, password):
    try:
        pluginOptions = readOptionDictByPlugin(pluginConfig['plugin'])
        if (not validAuthConfig(pluginOptions)):
            _logger.warning(authLogEntry(user, 'Failed login attempt'))
            return False
        conn = ldap.initialize(pluginOptions['Connection']['url'])
        conn.protocol_version = pluginOptions['Connection']['protocol']
        conn.set_option(ldap.OPT_REFERRALS, 0)
        conn.simple_bind_s(user.mail, password)
        _logger.info(authLogEntry(user, 'Successful login attempt'))
        return True
    except:
        _logger.warning(authLogEntry(user, 'Failed login attempt'))
        _logger.warning(' '.join(str(traceback.format_exc()).split()))
        return False
