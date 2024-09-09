"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import TaskForm from "../form.js";

export default function Home() {
  // Estado para controlar a visibilidade do formulário
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Função para alternar a visibilidade do formulário
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const [tarefas, setTarefas] = useState(null); // Estado inicial vazio


  useEffect(() => {
    // Função para buscar as tarefas do usuário
    async function fetchTarefas() {
      try {
        const response = await fetch('http://localhost:10000/task/search'); // Substitua 'usuario-id' pelo ID do usuário atual
        const data = await response.json();

        // Estrutura as tarefas no formato esperado
        const colunas = {
          coluna0: { id: "coluna0", title: "to do", taskIds: [] },
          coluna1: { id: "coluna1", title: "fazendo", taskIds: [] },
          coluna2: { id: "coluna2", title: "feito", taskIds: [] },
        };

        const tarefa = {};

        data.forEach(task => {
          // Distribua as tarefas nas colunas apropriadas (exemplo: com base no status da tarefa)
          if (task.TaskStatus === 'to do') {
            colunas.coluna0.taskIds.push(task.id);
          } else if (task.TaskStatus === 'fazendo') {
            colunas.coluna1.taskIds.push(task.id);
          } else if (task.TaskStatus === 'feito') {
            colunas.coluna2.taskIds.push(task.id);
          }

          tarefa[task.id] = {
            id: String(task.id),
            title: task.title,
            content: task.content,
            status: task.TaskStatus
          };
        });

        setTarefas({ colunas, tarefa });

      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    }

    fetchTarefas();
  }, []); // Executa o efeito apenas uma vez, após o primeiro render


  if (!tarefas || tarefas.length === 0) {
    return <p>Carregando...</p>;
  }
  console.log(tarefas)
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

    fetch(`http://localhost:10000/task/${draggableId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ TaskStatus: finishColuna.title }),
    }).then(() => {
      const newTaskIds = Array.from(startColuna.taskIds);
      newTaskIds.splice(source.index, 1);
      finishColuna.taskIds.splice(destination.index, 0, draggableId);

      setTarefas({
        ...tarefas,
        colunas: {
          ...tarefas.colunas,
          [source.droppableId]: { ...startColuna, taskIds: newTaskIds },
          [destination.droppableId]: finishColuna,
        },
      });
    });
  }

  return (
    <DragDropContext onDragEnd={reordenar}>
      <div className="flex justify-around	items-center h-screen">
        {Object.values(tarefas.colunas).map((coluna) => (
          <Droppable key={coluna.id} droppableId={coluna.id}>
            {(provided) => (
              <div
                className="bg-slate-500 w-64 h-[400px] rounded-md border-black p-4"
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
                            className="mt-2 border-slate-950 border-2 rounded-lg px-2 h-24"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h2 className="font-semibold ">
                              {task?.title}:
                            </h2>
                            <p className="mt-1 ">
                              {task?.content}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    );
                  })
                )}
                {coluna?.id === 'coluna0' ? (
                  <div>
                    <button onClick={toggleFormVisibility} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 absolute bottom-28 left-44">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      
                    </button>
                    {isFormVisible && (
                        <TaskForm onClose={toggleFormVisibility} />
                      )}
                  </div>
                ) : (
                  null
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