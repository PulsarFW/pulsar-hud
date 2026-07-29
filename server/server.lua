local hudConfig = load(LoadResourceFile(GetCurrentResourceName(), "config/shared.lua"))()

local _uircd = {}

CreateThread(function()
		RegisterChatCommands()

		plsr.Middleware:Add("Characters:Creating", function(source, cData)
			return {
				{
					HUDConfig = hudConfig.DefaultHUDConfig,
				},
			}
		end)
		plsr.Middleware:Add("Characters:Spawning", function(source)
			local char = plsr.Fetch:CharacterSource(source)
			local config = char:GetData("HUDConfig")
			if not config then
				char:SetData("HUDConfig", hudConfig.DefaultHUDConfig)
			end
		end, 1)

		plsr.Callbacks:RegisterServerCallback("HUD:SaveConfig", function(source, data, cb)
			local char = plsr.Fetch:CharacterSource(source)
			if char ~= nil then
				char:SetData("HUDConfig", data)
				cb(true)
			else
				cb(false)
			end
		end)

		plsr.Callbacks:RegisterServerCallback("HUD:RemoveBlindfold", function(source, data, cb)
			local char = plsr.Fetch:CharacterSource(source)
			if char ~= nil then
				if plsr.State:Player(data).isBlindfolded then
					plsr.Callbacks:ClientCallback(source, "HUD:PutOnBlindfold", "Removing Blindfold", function(isSuccess)
						if isSuccess then
							if plsr.Inventory:AddItem(char:GetData("SID"), "blindfold", 1, {}, 1) then
								plsr.State:SetPublicFlag(data, 'isBlindfolded', false)
								TriggerClientEvent("VOIP:Client:Gag:Use", data)
							else
								plsr.Execute:Client(source, "Notification", "Error", "Failed Adding Item")
								cb(false)
							end
						end
					end)
				else
					plsr.Execute:Client(source, "Notification", "Error", "Target Not Blindfolded")
					cb(false)
				end
			else
				cb(false)
			end
		end)

		plsr.Inventory.Items:RegisterUse("blindfold", "HUD", function(source, item, itemData)
			plsr.Callbacks:ClientCallback(source, "HUD:GetTargetInfront", {}, function(target)
				if target ~= nil then
					if not plsr.State:Player(target).isBlindfolded then
						plsr.Callbacks:ClientCallback(source, "HUD:PutOnBlindfold", "Blindfolding", function(isSuccess)
							if isSuccess then
								if plsr.State:Player(target).isCuffed then
									if plsr.Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, 1) then
										plsr.State:SetPublicFlag(target, 'isBlindfolded', true)
										TriggerClientEvent("VOIP:Client:Gag:Use", target)
									else
										plsr.Execute:Client(source, "Notification", "Error", "Failed Removing Item")
									end
								else
									plsr.Execute:Client(source, "Notification", "Error", "Target Not Cuffed")
								end
							end
						end)
					else
						plsr.Execute:Client(source, "Notification", "Error", "Target Already Blindfolded")
					end
				else
					plsr.Execute:Client(source, "Notification", "Error", "Nobody Near To Blindfold")
				end
			end)
		end)
end)

function RegisterChatCommands()
	plsr.Chat:RegisterCommand("uir", function(source, args, rawCommand)
		if not _uircd[source] or os.time() > _uircd[source] then
			TriggerClientEvent("UI:Client:Reset", source, true)
			_uircd[source] = os.time() + (60 * 5)
		else
			plsr.Chat.Send.System:Single(source, "You're Trying To Do This Too Much, Stop.")
		end
	end, {
		help = "Resets UI",
	})

	plsr.Chat:RegisterCommand("hud", function(source, args, rawCommand)
		TriggerClientEvent("UI:Client:Configure", source, true)
	end, {
		help = "Open HUD Config Menu",
	})

	plsr.Chat:RegisterAdminCommand("testblindfold", function(source, args, rawCommand)
		local char = plsr.Fetch:CharacterSource(source)
		if char ~= nil then
			plsr.State:SetPublicFlag(source, 'isBlindfolded', not plsr.State:Player(source).isBlindfolded)
		end
	end, {
		help = "Test Blindfold",
	})

	-- Chat:RegisterAdminCommand("notif", function(source, args, rawCommand)
	-- 	exports["pulsar_core"]:FetchComponent("Execute"):Client(source, "Notification", "Success", "This is a test, lul")
	-- end, {
	-- 	help = "Test Notification",
	-- })

	-- Chat:RegisterAdminCommand("list", function(source, args, rawCommand)
	-- 	TriggerClientEvent("ListMenu:Client:Test", source)
	-- end, {
	-- 	help = "Test List Menu",
	-- })

	-- Chat:RegisterAdminCommand("input", function(source, args, rawCommand)
	-- 	TriggerClientEvent("Input:Client:Test", source)
	-- end, {
	-- 	help = "Test Input",
	-- })

	-- Chat:RegisterAdminCommand("confirm", function(source, args, rawCommand)
	-- 	TriggerClientEvent("Confirm:Client:Test", source)
	-- end, {
	-- 	help = "Test Confirm Dialog",
	-- })

	-- Chat:RegisterAdminCommand("skill", function(source, args, rawCommand)
	-- 	TriggerClientEvent("Minigame:Client:Skillbar", source)
	-- end, {
	-- 	help = "Test Skill Bar",
	-- })

	-- Chat:RegisterAdminCommand("scan", function(source, args, rawCommand)
	-- 	TriggerClientEvent("Minigame:Client:Scanner", source)
	-- end, {
	-- 	help = "Test Scanner",
	-- })

	-- Chat:RegisterAdminCommand("sequencer", function(source, args, rawCommand)
	-- 	TriggerClientEvent("Minigame:Client:Sequencer", source)
	-- end, {
	-- 	help = "Test Sequencer",
	-- })

	-- Chat:RegisterAdminCommand("keypad", function(source, args, rawCommand)
	-- 	TriggerClientEvent("Minigame:Client:Keypad", source)
	-- end, {
	-- 	help = "Test Keypad",
	-- })

	-- Chat:RegisterAdminCommand("scrambler", function(source, args, rawCommand)
	-- 	TriggerClientEvent("Minigame:Client:Scrambler", source)
	-- end, {
	-- 	help = "Test Scrambler",
	-- })

	-- Chat:RegisterAdminCommand("memory", function(source, args, rawCommand)
	-- 	TriggerClientEvent("Minigame:Client:Memory", source)
	-- end, {
	-- 	help = "Test Memory",
	-- })
end
