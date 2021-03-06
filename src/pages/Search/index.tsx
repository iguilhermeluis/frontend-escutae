import React, { useCallback, useState, ChangeEventHandler } from "react";
import { IonFooter, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import * as S from "./styles";
import { SearchBar, TopicContainer } from "../../components/ui";
import _ from "lodash";
import { Keyable } from "../../types/Keyable";
import { api } from "../../services/api";
import FooterClose from "../../components/ui/FooterCloseButton";
import { useHistory } from "react-router";

interface Props {
  setShowModal: Function;
}
const SearchPage: React.FC<Props> = ({ setShowModal }) => {
  const [list, setList] = useState([]);
  const [isRead, setRead] = useState(false);
  const history = useHistory();

  const search = async (name: string) => {
    let response: Keyable = await api.post("/topic/search", { name });
    setList(response.data);
    if (!isRead) {
      setRead(true);
    }
  };

  const debouncedSave = useCallback(
    _.debounce((nextValue) => search(nextValue), 1000),
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    debouncedSave(event.target.value);
  };

  return (
    <IonPage>
      <S.StyledContent
        color="content-background-light"
        className="ion-padding ion-text-center"
      >
        <S.Header>
          <S.TitleSearch>Buscar Matéria</S.TitleSearch>
          <SearchBar onChange={handleChange} placeholder="Digite sua busca" />
        </S.Header>
        <div>
          {list.length > 0 ? (
            list.map((el: Keyable) => (
              <div
                key={el.id}
                onClick={() => {
                  history.push({
                    pathname: "/ListLesson",
                    state: {
                      id: el.title,
                      data: el,
                    },
                  });
                }}
              >
                <TopicContainer
                  setSelectedTopic={() => false}
                  data={el}
                  isSelected
                />
              </div>
            ))
          ) : isRead ? (
            <h5>Nenhuma matéria encontrada</h5>
          ) : (
            <h5>Faça sua busca</h5>
          )}
        </div>
      </S.StyledContent>

      <FooterClose setShowModal={setShowModal} />
    </IonPage>
  );
};

export default SearchPage;
