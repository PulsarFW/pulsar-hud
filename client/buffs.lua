local config = load(LoadResourceFile(GetCurrentResourceName(), "config/shared.lua"))()

local _runningIds = 1
local _buffDefs = {}

local _BUFFS = {
	RegisterBuff = function(self, id, icon, color, duration, type)
		_buffDefs[id] = {
			icon = icon,
			color = color,
			duration = duration,
			type = type,
		}
		SendNUIMessage({
			type = "REGISTER_BUFF",
			data = {
				id = id,
				data = {
					icon = icon,
					color = color,
					duration = duration,
					type = type,
				},
			},
		})
	end,
	ApplyBuff = function(self, buffId, val, override, options)
		SendNUIMessage({
			type = "BUFF_APPLIED",
			data = {
				instance = {
					buff = buffId,
					override = override,
					val = math.ceil(val or 0),
					options = options or {},
					startTime = GetCloudTimeAsInt(),
				},
			},
		})
	end,
	ApplyUniqueBuff = function(self, buffId, val, override, options)
		SendNUIMessage({
			type = "BUFF_APPLIED_UNIQUE",
			data = {
				instance = {
					buff = buffId,
					override = override,
					val = math.ceil(val or 0),
					options = options or {},
					startTime = GetCloudTimeAsInt(),
				},
			},
		})
	end,
	UpdateBuff = function(self, buffId, nVal)
		SendNUIMessage({
			type = "BUFF_UPDATED",
			data = {
				buff = buffId,
				val = nVal,
			},
		})
	end,
	IconOverride = function(self, buffId, override)
		SendNUIMessage({
			type = "BUFF_UPDATED",
			data = {
				buff = buffId,
				override = override,
			},
		})
	end,
	RemoveBuffType = function(self, buffId)
		SendNUIMessage({
			type = "REMOVE_BUFF_BY_TYPE",
			data = {
				type = buffId,
			},
		})
	end,
}

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["pulsar_core"]:RegisterComponent("Buffs", _BUFFS)
end)

RegisterNetEvent("Characters:Client:Spawned", function()
    _BUFFS:RegisterBuff("prog_mod", config.Buffs.prog_mod.icon, config.Buffs.prog_mod.color, -1, "timed")
    _BUFFS:RegisterBuff("stress_ticks", config.Buffs.stress_ticks.icon, config.Buffs.stress_ticks.color, -1, "timed")
    _BUFFS:RegisterBuff("heal_ticks", config.Buffs.heal_ticks.icon, config.Buffs.heal_ticks.color, -1, "timed")
    _BUFFS:RegisterBuff("armor_ticks", config.Buffs.armor_ticks.icon, config.Buffs.armor_ticks.color, -1, "timed")
end)

RegisterNetEvent("Characters:Client:Logout", function()
    _BUFFS:RemoveBuffType("prog_mod")
    _BUFFS:RemoveBuffType("stress_ticks")
    _BUFFS:RemoveBuffType("heal_ticks")
    _BUFFS:RemoveBuffType("armor_ticks")
end)
