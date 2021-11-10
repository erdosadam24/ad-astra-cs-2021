CXX = g++
CXXFLAGS = -g -std=c++11
EXEC = main
OBJS = ciff.o caff.o main.o# List of object files needed to
 # build the executable.
${EXEC}: ${OBJS}
	${CXX} ${CXXFLAGS} -o ${EXEC} ${OBJS}
ciff.o: src/ciff.cpp src/headers/ciff.h
	${CXX} ${CXXFLAGS} -c src/ciff.cpp
caff.o: src/caff.cpp src/headers/caff.h
	${CXX} ${CXXFLAGS} -c src/caff.cpp
main.o: main.cpp src/headers/caff.h
	${CXX} ${CXXFLAGS} -c main.cpp
clean:
	rm -f ${EXEC} ${OBJS}