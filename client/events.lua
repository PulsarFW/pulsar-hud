AddEventHandler("Vehicles:Client:EnterVehicle", function(currentVehicle, currentSeat)
	GLOBAL_VEH = currentVehicle
	plsr.Hud.Vehicle:Show()
	--Hud.Minimap:Set()
end)

AddEventHandler("Vehicles:Client:ExitVehicle", function(currentVehicle, currentSeat)
	plsr.Hud.Vehicle:Hide()
	GLOBAL_VEH = nil
end)

AddEventHandler("Characters:Client:Spawn", function()
	SendNUIMessage({
		type = "SET_CONFIG",
		data = {
			config = plsr.State.character.HUDConfig,
		},
	})

	plsr.Hud:Show()

	DisplayRadar(hasValue(plsr.State.character.States, "GPS"))
	plsr.Hud:ShiftLocation(hasValue(plsr.State.character.States, "GPS"))
end)

RegisterNetEvent("UI:Client:Reset", function(manual)
	plsr.Hud:Hide()
	SendNUIMessage({
		type = "UI_RESET",
		data = {
			manual = manual,
		},
	})

	if plsr.State.flags.loggedIn then
		SendNUIMessage({
			type = "SET_CONFIG",
			data = {
				config = plsr.State.character.HUDConfig,
			},
		})
	end

	plsr.Action:Hide()
	plsr.ListMenu:Close()
	plsr.Interaction:Hide()
	Notification:Clear()
	plsr.Confirm:Close()
	plsr.Input:Close()
	plsr.InfoOverlay:Close()
	plsr.Hud.Meth:Close()

	TriggerEvent("UI:Client:ResetFinished", manual)

	if manual then
		Wait(2500)
		plsr.Hud:Show()
		if plsr.Phone:IsOpen() or hasValue(plsr.State.character.States, "GPS") then
			DisplayRadar(true)
		end
	end
end)

RegisterNetEvent("Characters:Client:Logout", function()
	TriggerEvent("UI:Client:Reset")
end)

AddEventHandler("Vehicles:Client:Seatbelt", function(state)
	SendNUIMessage({
		type = "UPDATE_SEATBELT",
		data = { seatbelt = state },
	})
end)

AddEventHandler("Vehicles:Client:Cruise", function(state)
	SendNUIMessage({
		type = "UPDATE_CRUISE",
		data = { cruise = state },
	})
end)

AddEventHandler("Vehicles:Client:Ignition", function(state)
	SendNUIMessage({
		type = "UPDATE_IGNITION",
		data = { ignition = state },
	})
end)

AddEventHandler("Vehicles:Client:Fuel", function(amount, show)
	SendNUIMessage({
		type = "UPDATE_FUEL",
		data = {
			fuel = amount,
			fuelHide = show,
		},
	})
end)

RegisterNetEvent("Status:Client:Update", function(status, value)
	SendNUIMessage({
		type = "UPDATE_STATUS_VALUE",
		data = { name = status, value = value },
	})
end)

RegisterNetEvent("Progress:Client:Progress", function(action, cb)
	plsr.Progress:Progress(action, cb)
end)

RegisterNetEvent("Progress:Client:ProgressWithStartEvent", function(action, start, finish)
	plsr.Progress:ProgressWithStartEvent(action, start, finish)
end)

RegisterNetEvent("Progress:Client:ProgressWithTickEvent", function(action, tick, finish)
	plsr.Progress:ProgressWithTickEvent(action, tick, finish)
end)

RegisterNetEvent("Progress:Client:ProgressWithStartAndTick", function(action, start, tick, finish)
	plsr.Progress:ProgressWithStartAndTick(action, start, tick, finish)
end)

RegisterNetEvent("Progress:Client:Cancel", function()
	plsr.Progress:Cancel()
end)

RegisterNetEvent("Progress:Client:Fail", function()
	plsr.Progress:Fail()
end)

RegisterNUICallback("Progress:Finish", function(data, cb)
	plsr.Progress:Finish()
	cb("ok")
end)

AddEventHandler("Targeting:Client:UpdateState", function(isTargeting, hasTarget)
	SendNUIMessage({
		type = (isTargeting and "SHOW_EYE" or "HIDE_EYE"),
		data = {
			icon = (type(hasTarget) == "string" and hasTarget or false),
		},
	})
end)

AddEventHandler("Targeting:Client:OpenMenu", function(menuData)
	SetNuiFocus(true, true)
	SetCursorLocation(0.5, 0.5)
	SendNUIMessage({
		type = "OPEN_MENU",
		data = {
			menu = menuData,
		},
	})
end)

AddEventHandler("Targeting:Client:CloseMenu", function()
	SetNuiFocus(false, false)
	SendNUIMessage({
		type = "CLOSE_MENU",
		data = {},
	})
end)

RegisterNetEvent("UI:Client:Configure", function()
	SetNuiFocus(true, true)
	SendNUIMessage({
		type = "TOGGLE_SETTINGS",
		data = {
			state = true,
		},
	})
end)

RegisterNUICallback("targetingAction", function(data, cb)
	SetNuiFocus(false, false)
	SendNUIMessage({
		type = "CLOSE_MENU",
		data = {},
	})
	TriggerEvent("Targeting:Client:MenuSelect", data and data.event, data and data.data or {})
	cb("ok")
end)

RegisterNUICallback("CloseUI", function(data, cb)
	SetNuiFocus(false, false)
	cb("OK")
end)

RegisterNUICallback("SaveConfig", function(data, cb)
	plsr.Callbacks:ServerCallback("HUD:SaveConfig", data, function(s)
		cb(s)
	end)
end)
