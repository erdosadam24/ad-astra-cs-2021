# ad-astra-cs-2021
Futtatás:
A makefile futtatása után: 
main.exe "CAFF fájl elérési útja" "Hova szeretnénk menteni a képet"

Ellenőrzések:
-CAFF:
		-id: 1,2 3 vagy 3
		-length:
		-data:

-CAFF header:
	-ennek kell lennie az első blokknak
		-magic: azt írja-e hogy CAFF
		-header_size: egyenlő e a block size-zal
		-num_anim: 

-CAFF credits:
		-year: 1936-2021 között
		-month: 1-12 között
		-day: 1-31 hónaptól függ
		-óra: 1-23 között
		-perc: 0-60 között
		-creator_len
		-creator
		
-CAFF animation:
		-duration
		-ciff ->
		
CIFF:

-CIFF header:
		-magic: azt írja-e hogy CIFF
		-header size:
		-content size: egyenlő e 3xwxh-val
		-with: 0-nál nagyobb vagy egyenlő
		-height: 0-nál nagyobb vagy egyenlő
		-tags:

-CIFF content:
		-pixels: ha a with vagy a height 0 akkor a mérete 0

