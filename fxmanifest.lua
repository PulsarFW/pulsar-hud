fx_version 'cerulean'
games { 'gta5' }

name 'Pulsar HUD'
description 'Gameplay HUD with status bars, vehicle dash, and every shared overlay in the framework'
author 'Artmines - maintained for Pulsar Framework'
url 'https://pulsarframe.work'
version 'v1.0.0'

version_check 'yes'
github 'https://github.com/PulsarFW/pulsar_hud'

client_script '@pulsar_core/components/cl_error.lua'
shared_script '@pulsar_core/core/sh_pulsar.lua'
client_script '@pulsar_pwnzor/client/check.lua'

client_scripts({
	'client/*.lua',
	--'demo_games.lua',
})

server_scripts({
	'server/*.lua',
})

files({
	'ui/dist/index.html',
	'ui/dist/assets/*',
	'stream/minimap.gfx',
	'stream/****/handling.meta',  -- basic realistic vehicle handling
	'config/shared.lua',
})

data_file 'SCALEFORM_DLC_FILE' 'stream/minimap.gfx'
data_file 'HANDLING_FILE' 'stream/****/handling.meta'

ui_page('ui/dist/index.html')
lua54 'yes'
