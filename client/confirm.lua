local config = load(LoadResourceFile(GetCurrentResourceName(), "config/shared.lua"))()

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["pulsar_core"]:RegisterComponent("Confirm", CONFIRM)
end)

-- RegisterNetEvent("Confirm:Client:Test", function()
-- 	Confirm:Show(
-- 		"Test Input",
-- 		{
-- 			yes = "Confirm:Test:Yes",
-- 			no = "Confirm:Test:No",
-- 		},
-- 		"This is a test confirm dialog, neat",
-- 		{
-- 			test = "penis",
-- 		}
-- 	)
-- end)

-- AddEventHandler("Confirm:Test:Yes", function(data)
-- 	print("Confirm: Yes")
-- end)

-- AddEventHandler("Confirm:Test:No", function(data)
-- 	print("Confirm: No")
-- end)

RegisterNUICallback("Confirm:Yes", function(data, cb)
	plsr.UISounds.Play:FrontEnd(-1, "SELECT", config.SoundSet)
	if data.event then
		TriggerEvent(data.event, data.data)
	end
	plsr.Confirm:Close()
	cb("ok")
end)

RegisterNUICallback("Confirm:No", function(data, cb)
	plsr.UISounds.Play:FrontEnd(-1, "BACK", config.SoundSet)
	if data and data.event then
		TriggerEvent(data.event, data.data)
	end
	plsr.Confirm:Close()
	cb("ok")
end)

CONFIRM = {
	Show = function(self, title, events, description, data, denyLabel, acceptLabel)
		SetNuiFocus(true, true)
		SendNUIMessage({
			type = "SHOW_CONFIRM",
			data = {
				title = title,
				yes = events.yes,
				no = events.no,
				description = description,
				data = data,
				denyLabel = denyLabel,
				acceptLabel = acceptLabel,
			},
		})
	end,
	Close = function(self)
		SetNuiFocus(false, false)
		SendNUIMessage({
			type = "CLOSE_CONFIRM",
		})
	end,
}
