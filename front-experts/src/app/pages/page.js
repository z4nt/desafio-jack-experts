"use client";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function Home() {
  const [tarefas, setTarefas] = useState({
    colunas: {
      coluna0: {
        id: "coluna0",
        title: "To do",
        taskIds: ["1", "2", "3", "4"],
      },
      coluna1: {
        id: "coluna1",
        title: "Fazendo",
        taskIds: ["5", "6", "7", "8"],
      },
      coluna2: {
        id: "coluna2",
        title: "Feito",
        taskIds: ["9", "10", "11", "12"],
      },
    },
    tarefa: {
      1: {
        id: "1",
        content: "Tarefa 1",
      },
      2: {
        id: "2",
        content: "Tarefa 2",
      },
      3: {
        id: "3",
        content: "Tarefa 3",
      },
      4: {
        id: "4",
        content: "Tarefa 4",
      },
      5: {
        id: "5",
        content: "Tarefa 5",
      },
      6: {
        id: "6",
        content: "Tarefa 6",
      },
      7: {
        id: "7",
        content: "Tarefa 7",
      },
      8: {
        id: "8",
        content: "Tarefa 8",
      },
      9: {
        id: "9",
        content: "Tarefa 9",
      },
      10: {
        id: "10",
        content: "Tarefa 10",
      },
      11: {
        id: "11",
        content: "Tarefa 11",
      },
      12: {
        id: "12",
        content: "Tarefa 12",
      },
    },
  });

  if (!tarefas || tarefas.length === 0) {
    return <p>Carregando...</p>;
  }

  function reordenar(result) {
    const { destination, source, draggableId } = result;

    // Se não há destino (tarefa solta fora de qualquer coluna), retorna sem fazer nada
    if (!destination) return;

    // Se a posição da tarefa não mudou, retorna sem fazer nada
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Obtenha a coluna de origem e a coluna de destino
    const startColuna = tarefas.colunas[source.droppableId];
    const finishColuna = tarefas.colunas[destination.droppableId];

    // console.log({
    //   colunas: tarefas.colunas,
    //   startColuna,
    //   finishColuna,
    //   source: source.droppableId,
    //   destination: destination.droppableId,
    // })

    // Caso a tarefa tenha sido movida dentro da mesma coluna
    if (startColuna === finishColuna) {
      const newTaskIds = Array.from(startColuna?.taskIds || []);
      newTaskIds.splice(source.index, 1); // Remove a tarefa da posição antiga
      newTaskIds.splice(destination.index, 0, draggableId); // Adiciona a tarefa na nova posição

      // Cria a nova coluna com as tarefas reordenadas
      const newColuna = {
        ...startColuna,
        taskIds: newTaskIds,
      };

      // Atualiza o estado
      setTarefas((prevState) => ({
        ...prevState,
        colunas: {
          ...prevState.colunas,
          [newColuna.id]: newColuna,
        },
      }));

      return;
    }

    // Caso a tarefa tenha sido movida para outra coluna
    const startTaskIds = Array.from(startColuna.taskIds);
    startTaskIds.splice(source.index, 1); // Remove a tarefa da coluna de origem

    const finishTaskIds = Array.from(finishColuna.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId); // Adiciona a tarefa na coluna de destino

    // Cria as novas colunas com as atualizações
    const newStartColuna = {
      ...startColuna,
      taskIds: startTaskIds,
    };

    const newFinishColuna = {
      ...finishColuna,
      taskIds: finishTaskIds,
    };

    // Atualiza o estado
    setTarefas((prevState) => ({
      ...prevState,
      colunas: {
        ...prevState.colunas,
        [newStartColuna.id]: newStartColuna,
        [newFinishColuna.id]: newFinishColuna,
      },
    }));
  }

  return (
    <DragDropContext onDragEnd={reordenar}>
    <div className="flex justify-around	">
      {Object.values(tarefas.colunas).map((coluna) => (
        <Droppable key={coluna.id} droppableId={coluna.id}>
          {(provided) => (
            <div
              className="bg-slate-500 w-64 h-[300px] rounded-md border-black p-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <h2 className="text-center">{coluna.title}</h2>
              {(coluna?.taskIds || []).length === 0 ? (
                <p>Sem tarefas</p>
              ) : (
                (coluna?.taskIds || []).map((taskId, index) => {
                  const task = tarefas.tarefa[taskId];
                  return (
                    <Draggable
                      key={task?.id}
                      draggableId={task?.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="mt-2 border-slate-950 border-2"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p className="text-black text-center">
                            {task?.content}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  );
                })
              )}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
      </div>
    </DragDropContext>
  );
}