#!/bin/sh

for file in output/*/*;
	do 
	mv $file $(echo $file | tr :,+ ___)
done
