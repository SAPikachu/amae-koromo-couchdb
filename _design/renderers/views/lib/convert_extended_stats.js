exports.func = function func(value) {
	var buildFans = require("views/lib/build_fans");
	var result = {
		count: value.count,
		和牌率: value.和 / value.count,
		自摸率: value.自摸 / value.和,
		默听率: value.默听 / value.和,
		放铳率: value.放铳 / value.count,
		副露率: value.副露 / value.count,
		立直率: value.立直 / value.count,
		平均打点: Math.round(value.和了点数 / value.和 * 100),
		最大连庄: value.最大连庄,
		和了巡数: value.和了巡数 / value.和,
		平均铳点: Math.round(value.放铳点数 / value.放铳 * 100),
		流局率: value.流局 / value.count,
		流听率: value.流局听牌 / value.流局,
		一发率: value.一发 / value.立直和了,
		里宝率: value.里宝 / value.立直和了,
		被炸率: value.被炸 / value.被自摸,
		平均被炸点数: Math.round(value.被炸点数 / value.被炸 * 100),
		放铳时立直率: value.放铳时立直 / value.放铳,
		放铳时副露率: value.放铳时副露 / value.放铳,
		立直后放铳率: value.放铳时立直 / value.立直,
		立直后非瞬间放铳率: (value.放铳时立直 - (value.立直瞬间放铳 || 0)) / value.立直,
		副露后放铳率: value.放铳时副露 / value.副露,
		立直后和牌率: value.立直和了 / value.立直,
		副露后和牌率: value.副露和了 / value.副露,
		立直后流局率: value.立直流局 / value.立直,
		副露后流局率: value.副露流局 / value.副露,
		放铳至立直: value.放铳至立直,
		放铳至副露: value.放铳至副露,
		放铳至默听: value.放铳至默听,
		立直和了: value.立直和了,
		副露和了: value.副露和了,
		默听和了: value.默听,
		立直巡目: value.立直巡目 / value.立直,
		立直收支: Math.round(((value.立直收入 || 0) - (value.立直支出 || 0) + (value.立直流局收支 || 0) + (value.立直其它收支 || 0)) * 100 / value.立直),
		立直收入: Math.round(value.立直收入 * 100 / value.立直和了),
		立直支出: Math.round(value.立直支出 * 100 / value.放铳时立直),
		先制率: value.先制立直 / value.立直,
		追立率: value.追立 / value.立直,
		被追率: value.被追立 / value.立直,
		振听立直率: (value.振听立直 || 0) / value.立直,
		役满: value.役满,
		累计役满: value.累计役满,
		最大累计番数: value.最大累计番数,
		W立直: value.W立直,
		流满: value.流满,
		平均起手向听: value.起手向听 / value.count,
		最近大铳: value.最近大铳 ? {
			id: value.最近大铳[3],
			start_time: value.最近大铳[4],
			fans: buildFans(value.最近大铳[1]),
		} : undefined,
	};
	return result;
}