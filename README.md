# ad-astra-cs-2021

Caff Parser használata példa: 

1.) Létrehozunk egy Caff objektumot egy adott elérési úttal
	Caff CaffObj("caff fájl elérési útja");
2.) Meghívjuk a parseCaff függvényt, itt kapjuk meg a hibaüzenetet ha rossz formátumú a Caff fájl
	CaffObj.parseCaff();
3.) A Caff fájlban lévő egyik Ciff fájlból létrehozunk egy képet
	Az első paraméter azt adja meg, hogy hova mentsük el a képet (.bmp-re kell végződnie), a második paraméter megadja hogy a Caff fájlban tárolt hányadik Ciff fájlt alakítsuk képpé, alapértelmezetten ez 0
	CaffObj.saveAsImage("kép elérési útja", 0);