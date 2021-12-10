################################################################################
# Author:     Thomas D'haenens
# License:    GPL-3.0
# Link:       https://github.com/BENEATLY/neat-community-plugins/
# Contact:    https://neatly.be/
################################################################################


# IMPORT: Standard Modules

# IMPORT: Custom Modules
from basic import *                                                                         # Basic Lib
from plugins import PluginAPIHandler as APIHandler                                          # Plugin Api Handler
from plugins import hasPluginOptionRights                                                   # Plugin Option Rights Check
from actions import registerAction as register                                              # Action Register


# CONFIGURATION: Plugin
pluginConfig = {'plugin': {'id': 16, 'name': 'Application Look & Feel'}}


# FUNCTION: Upload Logo
@log(returnValue=False)
@fileUpload([{'name': 'file', 'secure': True, 'contentType': 'image'}])
@register(pluginConfig, action='logo', meta=(lambda x: {'file': {'fileName': x['files']['file']['fileName']}}))
def uploadLogo(**params):

    # Create Storage Folder
    createDir('/etc/neatly/base/gui')
    createDir('/etc/neatly/base/gui/logos')

    # Log Message
    _logger.info('Uploading new logo: ' + params['files']['file']['fileName'])

    # Save Logo
    params['files']['file']['file'].save('/etc/neatly/base/gui/logos/' + params['files']['file']['fileName'])

    # Success
    return True


# FUNCTION: Upload Icon
@log(returnValue=False)
@fileUpload([{'name': 'file', 'secure': True}])
@register(pluginConfig, action='icon', meta=(lambda x: {'file': {'fileName': x['files']['file']['fileName']}}))
def uploadIcon(**params):

    # Create Storage Folder
    createDir('/etc/neatly/base/gui')
    createDir('/etc/neatly/base/gui/icons')

    # Log Message
    _logger.info('Uploading new icon: ' + params['files']['file']['fileName'])

    # Save Icon
    params['files']['file']['file'].save('/etc/neatly/base/gui/icons/' + params['files']['file']['fileName'])

    # Success
    return True


# Upload Logo
@log(returnValue=('', 400))
@APIHandler(authenticated=True, method='POST', actionName='logo')
@hasPluginOptionRights(group='UI', option='appLogo', action='Edit')
def executeUploadLogo(**params):
    success = uploadLogo(**params)
    return (('', 200) if success else ('', 400))


# Upload Icon
@log(returnValue=('', 400))
@APIHandler(authenticated=True, method='POST', actionName='icon')
@hasPluginOptionRights(group='UI', option='appIcon', action='Edit')
def executeUploadIcon(**params):
    success = uploadIcon(**params)
    return (('', 200) if success else ('', 400))


# API FUNCTION: Handle API Request
def handleAPIRequest(**params):
    return APIHandler.execute(**params)
