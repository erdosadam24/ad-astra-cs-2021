CXX = g++
CXXFLAGS = -g -std=c++11
EXEC = main
OBJS = ciff.o caff.o main.o# List of object files needed to
 # build the executable.
${EXEC}: ${OBJS}
	${CXX} ${CXXFLAGS} -o ${EXEC} ${OBJS}
ciff.o: Ciff.cpp Ciff.h
	${CXX} ${CXXFLAGS} -c Ciff.cpp
caff.o: Caff.cpp Caff.h
	${CXX} ${CXXFLAGS} -c Caff.cpp
main.o: main.cpp Caff.h
	${CXX} ${CXXFLAGS} -c main.cpp
clean:
	rm -f ${EXEC} ${OBJS}